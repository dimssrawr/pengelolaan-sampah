import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

// Helper to verify user session (both ADMIN and USER)
async function verifyUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    if (!sessionCookie || !sessionCookie.value) return null;

    const session = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
    if (session && (session.role === "ADMIN" || session.role === "USER")) {
      return session;
    }
  } catch {}
  return null;
}

// GET: List waste reports (supports filtering by jenisSampahId, wilayahId, and myOnly for citizens)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const jenisSampahId = searchParams.get("jenisSampahId");
    const wilayahId = searchParams.get("wilayahId");
    const myOnly = searchParams.get("myOnly") === "true";

    const where: any = {};

    if (jenisSampahId) {
      where.jenisSampahId = jenisSampahId;
    }

    if (wilayahId) {
      where.wilayahId = wilayahId;
    }

    // Role-based filter for citizens
    const session = await verifyUser();
    if (myOnly && session && session.role === "USER") {
      where.userId = session.userId;
    }

    const reports = await prisma.laporanSampah.findMany({
      where,
      include: {
        jenisSampah: true,
        wilayah: true,
        user: {
          select: { id: true, email: true, nama: true, role: true },
        },
        fotoSampah: true,
      },
      orderBy: {
        tanggalLapor: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Submit a new LaporanSampah (Admin and User role, handles file upload for FotoSampah)
export async function POST(req: NextRequest) {
  try {
    const user = await verifyUser();
    if (!user) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login terlebih dahulu." }, { status: 403 });
    }

    const formData = await req.formData();
    const beratStr = formData.get("berat") as string;
    const jenisSampahId = formData.get("jenisSampahId") as string;
    const wilayahId = formData.get("wilayahId") as string;
    const file = formData.get("foto") as File | null;

    if (!beratStr || !jenisSampahId || !wilayahId) {
      return NextResponse.json({ error: "Berat, jenis, dan wilayah harus diisi." }, { status: 400 });
    }

    const berat = parseFloat(beratStr);
    if (isNaN(berat)) {
      return NextResponse.json({ error: "Berat harus berupa angka." }, { status: 400 });
    }

    // Validasi berat harus lebih dari 0 kg
    if (berat <= 0) {
      return NextResponse.json({ error: "Validasi Gagal: Berat sampah harus lebih dari 0 kg." }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Validasi Gagal: Foto bukti sampah harus diunggah." }, { status: 400 });
    }

    // Save image file locally
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    const fotoUrl = `/uploads/${filename}`;

    // Database transactional write: Ensure report and photo are created together (One-to-One rule)
    const newReport = await prisma.$transaction(async (tx) => {
      // 1. Create LaporanSampah
      const lap = await tx.laporanSampah.create({
        data: {
          berat,
          userId: user.userId,
          jenisSampahId,
          wilayahId,
        },
      });

      // 2. Create FotoSampah linked to Laporan
      const foto = await tx.fotoSampah.create({
        data: {
          imageUrl: fotoUrl,
          laporanId: lap.id,
        },
      });

      return { ...lap, fotoSampah: foto };
    });

    // Re-fetch with all joins for response
    const finalReport = await prisma.laporanSampah.findUnique({
      where: { id: newReport.id },
      include: {
        jenisSampah: true,
        wilayah: true,
        user: { select: { id: true, email: true, nama: true } },
        fotoSampah: true,
      },
    });

    return NextResponse.json(finalReport, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing report
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyUser();
    if (!user) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login terlebih dahulu." }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID dibutuhkan" }, { status: 400 });
    }

    // Check if report exists
    const existingReport = await prisma.laporanSampah.findUnique({
      where: { id },
      include: { fotoSampah: true },
    });

    if (!existingReport) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    }

    // Security check: Only Admin or the owner can edit this report
    if (user.role !== "ADMIN" && existingReport.userId !== user.userId) {
      return NextResponse.json({ error: "Akses ditolak. Ini bukan laporan milik Anda." }, { status: 403 });
    }

    const formData = await req.formData();
    const beratStr = formData.get("berat") as string;
    const jenisSampahId = formData.get("jenisSampahId") as string;
    const wilayahId = formData.get("wilayahId") as string;
    const file = formData.get("foto") as File | null;

    if (!beratStr || !jenisSampahId || !wilayahId) {
      return NextResponse.json({ error: "Berat, jenis, dan wilayah harus diisi." }, { status: 400 });
    }

    const berat = parseFloat(beratStr);
    if (isNaN(berat) || berat <= 0) {
      return NextResponse.json({ error: "Berat harus berupa angka lebih dari 0 kg." }, { status: 400 });
    }

    // Update main report fields
    await prisma.laporanSampah.update({
      where: { id },
      data: {
        berat,
        jenisSampahId,
        wilayahId,
      },
    });

    // If new file is uploaded, replace old file and update photo model
    if (file && file.size > 0 && existingReport.fotoSampah) {
      // Delete old file
      const oldFilePath = path.join(process.cwd(), "public", existingReport.fotoSampah.imageUrl);
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.error("Failed to delete old file:", err);
      }

      // Save new file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      const fotoUrl = `/uploads/${filename}`;

      // Update photo record
      await prisma.fotoSampah.update({
        where: { id: existingReport.fotoSampah.id },
        data: { imageUrl: fotoUrl },
      });
    }

    const finalReport = await prisma.laporanSampah.findUnique({
      where: { id },
      include: {
        jenisSampah: true,
        wilayah: true,
        user: { select: { id: true, email: true, nama: true } },
        fotoSampah: true,
      },
    });

    return NextResponse.json(finalReport);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a report (and automatically cascade delete its FotoSampah in PostgreSQL)
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyUser();
    if (!user) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login terlebih dahulu." }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID dibutuhkan" }, { status: 400 });
    }

    const report = await prisma.laporanSampah.findUnique({
      where: { id },
      include: { fotoSampah: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    }

    // Security check: Only Admin or the owner can delete this report
    if (user.role !== "ADMIN" && report.userId !== user.userId) {
      return NextResponse.json({ error: "Akses ditolak. Ini bukan laporan milik Anda." }, { status: 403 });
    }

    // Delete file from disk
    if (report.fotoSampah) {
      const filePath = path.join(process.cwd(), "public", report.fotoSampah.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete file from disk:", err);
      }
    }

    // Delete parent report (FotoSampah row deleted automatically in PostgreSQL due to onDelete: Cascade)
    await prisma.laporanSampah.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
