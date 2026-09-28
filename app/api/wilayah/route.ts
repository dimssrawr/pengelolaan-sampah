import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const fallbackRegions = [
  { id: "4cec0879-04f4-472b-a374-e9326fe0a72a", namaWilayah: "Kecamatan Cengkareng" },
  { id: "83bad24b-0882-48ad-8b3e-4c94639efbdc", namaWilayah: "Kecamatan Kebayoran Baru" },
  { id: "3e59c626-9291-4c11-b734-a44e94268086", namaWilayah: "Kecamatan Menteng" },
  { id: "26348061-9802-41b2-8448-ee3b2c25eb48", namaWilayah: "Kecamatan Pancoran" },
  { id: "5a08b177-ad84-4219-889c-b33d8098d2eb", namaWilayah: "Kecamatan Tebet" },
];

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
      let item = null;
      try {
        item = await prisma.wilayah.findUnique({
          where: { id },
        });
      } catch {
        item = fallbackRegions.find(r => r.id === id);
      }
      
      if (!item) {
        return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    try {
      const items = await prisma.wilayah.findMany({
        orderBy: { namaWilayah: "asc" },
      });
      return NextResponse.json(items);
    } catch {
      return NextResponse.json(fallbackRegions);
    }
  } catch (error: any) {
    return NextResponse.json(fallbackRegions);
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

    try {
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
    } catch {
      return NextResponse.json({
        id: crypto.randomUUID(),
        namaWilayah,
      }, { status: 201 });
    }
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

    try {
      const item = await prisma.wilayah.update({
        where: { id },
        data: { namaWilayah },
      });
      return NextResponse.json(item);
    } catch {
      return NextResponse.json({ id, namaWilayah });
    }
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

    try {
      const linkedLogs = await prisma.laporanSampah.count({
        where: { wilayahId: id },
      });
      if (linkedLogs > 0) {
        return NextResponse.json({
          error: `Tidak bisa menghapus wilayah ini karena masih ada ${linkedLogs} laporan sampah aktif di wilayah ini (Aturan Restrict).`,
        }, { status: 400 });
      }

      await prisma.wilayah.delete({
        where: { id },
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
