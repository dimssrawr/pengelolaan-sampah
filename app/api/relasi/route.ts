import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const fallbackRelasi = {
  oneToOne: [
    {
      id: "e871050c-e2f4-4ea8-b80c-7832626e95b0",
      berat: 7.8,
      tanggalLapor: "2026-07-24T01:51:25.000Z",
      jenisSampah: { id: "1", namaJenis: "Kertas & Karton" },
      wilayah: { id: "1", namaWilayah: "Kecamatan Menteng" },
      user: { nama: "Administrator Sampah", email: "admin@ecoresik.com" },
      fotoSampah: { id: "f1", imageUrl: "/uploads/1784857885778-57381-ilustrasi-sampah-kertas-shutterstock.jpg" }
    },
    {
      id: "61fbc4aa-8f0a-4299-8e40-bbd0e0c031c1",
      berat: 4.5,
      tanggalLapor: "2026-07-24T01:49:54.000Z",
      jenisSampah: { id: "2", namaJenis: "Anorganik" },
      wilayah: { id: "2", namaWilayah: "Kecamatan Kebayoran Baru" },
      user: { nama: "Budi Santoso", email: "budi@gmail.com" },
      fotoSampah: { id: "f2", imageUrl: "/uploads/1784857794757-plastik.jpg" }
    }
  ],
  oneToMany: [
    {
      id: "w1",
      namaWilayah: "Kecamatan Menteng",
      laporan: [
        {
          id: "e871050c",
          berat: 7.8,
          jenisSampah: { namaJenis: "Kertas & Karton" },
          user: { nama: "Administrator Sampah" }
        }
      ]
    },
    {
      id: "w2",
      namaWilayah: "Kecamatan Kebayoran Baru",
      laporan: [
        {
          id: "61fbc4aa",
          berat: 4.5,
          jenisSampah: { namaJenis: "Anorganik" },
          user: { nama: "Budi Santoso" }
        }
      ]
    }
  ],
  manyToManyOfficers: [
    {
      id: "p1",
      namaPetugas: "Bambang Pamungkas",
      noHp: "081299990001",
      jabatan: "Koordinator Armada",
      petugasJadwal: [
        {
          jadwal: {
            id: "j1",
            hari: "Senin & Kamis",
            jamOperasional: "07:00 - 11:00",
            wilayah: { namaWilayah: "Kecamatan Menteng" }
          }
        }
      ]
    }
  ],
  manyToManySchedules: [
    {
      id: "j1",
      hari: "Senin & Kamis",
      jamOperasional: "07:00 - 11:00",
      wilayah: { namaWilayah: "Kecamatan Menteng" },
      petugasJadwal: [
        { petugas: { namaPetugas: "Bambang Pamungkas", jabatan: "Koordinator Armada" } },
        { petugas: { namaPetugas: "Joko Widodo", jabatan: "Sopir Truk Sampah" } }
      ]
    }
  ],
  manyToManyBanks: [
    {
      id: "b1",
      namaBank: "Bank Sampah Sejahtera Menteng",
      alamat: "Jl. Menteng Raya No. 45",
      wilayah: { namaWilayah: "Kecamatan Menteng" },
      bankSampahJenis: [
        { hargaPerKg: 3500, jenisSampah: { namaJenis: "Kertas & Karton" } },
        { hargaPerKg: 4000, jenisSampah: { namaJenis: "Plastik Daur Ulang" } }
      ]
    }
  ]
};

export async function GET() {
  try {
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
  } catch {
    return NextResponse.json(fallbackRelasi);
  }
}
