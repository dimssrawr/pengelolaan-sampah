import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Helper to verify admin session
async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    if (!sessionCookie || !sessionCookie.value) return null;

    const session = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
    if (session && session.role === "ADMIN") {
      return session;
    }
  } catch {}
  return null;
}

// GET: List all categories
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (id) {
      const item = await prisma.jenisSampah.findUnique({
        where: { id },
      });
      
      if (!item) {
        return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    const items = await prisma.jenisSampah.findMany({
      orderBy: { namaJenis: "asc" },
    });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login sebagai admin." }, { status: 403 });
    }

    const { namaJenis } = await req.json();
    if (!namaJenis || namaJenis.trim() === "") {
      return NextResponse.json({ error: "Nama jenis sampah harus diisi" }, { status: 400 });
    }

    // Check unique constraint
    const existing = await prisma.jenisSampah.findUnique({
      where: { namaJenis },
    });
    if (existing) {
      return NextResponse.json({ error: "Nama jenis sampah sudah terdaftar" }, { status: 400 });
    }

    const item = await prisma.jenisSampah.create({
      data: { namaJenis },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update category (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login sebagai admin." }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID dibutuhkan" }, { status: 400 });
    }

    const { namaJenis } = await req.json();
    if (!namaJenis || namaJenis.trim() === "") {
      return NextResponse.json({ error: "Nama jenis sampah harus diisi" }, { status: 400 });
    }

    // Check unique constraint
    const existing = await prisma.jenisSampah.findFirst({
      where: {
        namaJenis,
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Nama jenis sampah sudah terdaftar" }, { status: 400 });
    }

    const item = await prisma.jenisSampah.update({
      where: { id },
      data: { namaJenis },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete category (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login sebagai admin." }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID dibutuhkan" }, { status: 400 });
    }

    // Check if category is used in active reports (onDelete: Restrict simulation)
    const linkedLogs = await prisma.laporanSampah.count({
      where: { jenisSampahId: id },
    });
    if (linkedLogs > 0) {
      return NextResponse.json({
        error: `Tidak bisa menghapus jenis sampah ini karena masih digunakan oleh ${linkedLogs} laporan sampah (Aturan Restrict).`,
      }, { status: 400 });
    }

    await prisma.jenisSampah.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
