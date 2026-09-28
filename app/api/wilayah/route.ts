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

// GET: List all regions
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (id) {
      const item = await prisma.wilayah.findUnique({
        where: { id },
      });
      
      if (!item) {
        return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    const items = await prisma.wilayah.findMany({
      orderBy: { namaWilayah: "asc" },
    });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new region (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak. Silakan login sebagai admin." }, { status: 403 });
    }

    const { namaWilayah } = await req.json();
    if (!namaWilayah || namaWilayah.trim() === "") {
      return NextResponse.json({ error: "Nama wilayah harus diisi" }, { status: 400 });
    }

    // Check unique constraint
    const existing = await prisma.wilayah.findUnique({
      where: { namaWilayah },
    });
    if (existing) {
      return NextResponse.json({ error: "Nama wilayah sudah terdaftar" }, { status: 400 });
    }

    const item = await prisma.wilayah.create({
      data: { namaWilayah },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update region (Admin only)
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

    const { namaWilayah } = await req.json();
    if (!namaWilayah || namaWilayah.trim() === "") {
      return NextResponse.json({ error: "Nama wilayah harus diisi" }, { status: 400 });
    }

    // Check unique constraint
    const existing = await prisma.wilayah.findFirst({
      where: {
        namaWilayah,
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Nama wilayah sudah terdaftar" }, { status: 400 });
    }

    const item = await prisma.wilayah.update({
      where: { id },
      data: { namaWilayah },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete region (Admin only)
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

    // Check if region is used in active reports (onDelete: Restrict simulation)
    const linkedLogs = await prisma.laporanSampah.count({
      where: { wilayahId: id },
    });
    if (linkedLogs > 0) {
      return NextResponse.json({
        error: `Tidak bisa menghapus wilayah ini karena masih digunakan oleh ${linkedLogs} laporan sampah (Aturan Restrict).`,
      }, { status: 400 });
    }

    await prisma.wilayah.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
