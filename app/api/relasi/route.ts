import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. One to One: Laporan with FotoSampah
    const oneToOne = await prisma.laporanSampah.findMany({
      take: 4,
      include: {
        fotoSampah: true,
        user: { select: { nama: true, email: true } },
        jenisSampah: true,
        wilayah: true,
      },
      orderBy: { tanggalLapor: "desc" },
    });

    // 2. One to Many: Wilayah with its LaporanSampah
    const oneToMany = await prisma.wilayah.findMany({
      include: {
        laporan: {
          include: {
            user: { select: { nama: true } },
            jenisSampah: true,
          },
        },
      },
    });

    // 3. Many to Many: Petugas with their assigned JadwalPengangkutan
    const manyToManyOfficers = await prisma.petugas.findMany({
      include: {
        petugasJadwal: {
          include: {
            jadwal: {
              include: {
                wilayah: true,
              },
            },
          },
        },
      },
    });

    // Many to Many: JadwalPengangkutan with their assigned Petugas
    const manyToManySchedules = await prisma.jadwalPengangkutan.findMany({
      include: {
        wilayah: true,
        petugasJadwal: {
          include: {
            petugas: true,
          },
        },
      },
    });

    // Many to Many: BankSampah with accepted JenisSampah and prices
    const manyToManyBanks = await prisma.bankSampah.findMany({
      include: {
        wilayah: true,
        bankSampahJenis: {
          include: {
            jenisSampah: true,
          },
        },
      },
    });

    return NextResponse.json({
      oneToOne,
      oneToMany,
      manyToManyOfficers,
      manyToManySchedules,
      manyToManyBanks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
