import { prisma } from "../lib/prisma";
import crypto from "crypto";

async function main() {
  console.log("Seeding started...");

  // 1. Seed Admin User
  const passwordHash = crypto.createHash("sha256").update("admin123").digest("hex");
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecoresik.com" },
    update: {},
    create: {
      nama: "Administrator Sampah",
      email: "admin@ecoresik.com",
      noHp: "081234567890",
      nik: "1234567890123456",
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Seed citizen user (warga)
  const citizenPwHash = crypto.createHash("sha256").update("warga123").digest("hex");
  const citizen = await prisma.user.upsert({
    where: { email: "budi@gmail.com" },
    update: {},
    create: {
      nama: "Budi Santoso",
      email: "budi@gmail.com",
      noHp: "089876543210",
      nik: "3201020304050001",
      password: citizenPwHash,
      role: "USER",
    },
  });
  console.log(`Citizen user seeded: ${citizen.email}`);

  // 3. Seed JenisSampah
  const categories = [
    { namaJenis: "Organik" },
    { namaJenis: "Anorganik" },
    { namaJenis: "B3" },
    { namaJenis: "Kertas & Karton" },
    { namaJenis: "Plastik Daur Ulang" },
  ];

  const seededCategories: any[] = [];
  for (const cat of categories) {
    const item = await prisma.jenisSampah.upsert({
      where: { namaJenis: cat.namaJenis },
      update: {},
      create: cat,
    });
    seededCategories.push(item);
    console.log(`Jenis sampah seeded: ${item.namaJenis}`);
  }

  // 4. Seed Wilayah
  const regions = [
    { namaWilayah: "Kecamatan Pancoran" },
    { namaWilayah: "Kecamatan Tebet" },
    { namaWilayah: "Kecamatan Cengkareng" },
    { namaWilayah: "Kecamatan Menteng" },
    { namaWilayah: "Kecamatan Kebayoran Baru" },
  ];

  const seededRegions: any[] = [];
  for (const reg of regions) {
    const item = await prisma.wilayah.upsert({
      where: { namaWilayah: reg.namaWilayah },
      update: {},
      create: reg,
    });
    seededRegions.push(item);
    console.log(`Wilayah seeded: ${item.namaWilayah}`);
  }

  // 5. Seed Petugas (Model 6)
  const officers = [
    { namaPetugas: "Joko Widodo", noHp: "081234567801", jabatan: "Supir Truk Kebersihan" },
    { namaPetugas: "Slamet Riyadi", noHp: "081234567802", jabatan: "Petugas Angkut Sampah" },
    { namaPetugas: "Siti Aminah", noHp: "081234567803", jabatan: "Koordinator Wilayah" },
  ];

  const seededOfficers: any[] = [];
  for (const off of officers) {
    const item = await prisma.petugas.upsert({
      where: { noHp: off.noHp },
      update: {},
      create: off,
    });
    seededOfficers.push(item);
    console.log(`Petugas seeded: ${item.namaPetugas}`);
  }

  // 6. Seed JadwalPengangkutan (Model 7)
  const schedules = [
    { hari: "Senin & Kamis", jamOperasional: "07:00 - 11:00 WIB", wilayahId: seededRegions[0].id },
    { hari: "Selasa & Jumat", jamOperasional: "08:00 - 12:00 WIB", wilayahId: seededRegions[1].id },
    { hari: "Rabu & Sabtu", jamOperasional: "07:30 - 11:30 WIB", wilayahId: seededRegions[2].id },
  ];

  const seededSchedules: any[] = [];
  for (const sch of schedules) {
    let item = await prisma.jadwalPengangkutan.findFirst({
      where: { hari: sch.hari, wilayahId: sch.wilayahId },
    });
    if (!item) {
      item = await prisma.jadwalPengangkutan.create({ data: sch });
    }
    seededSchedules.push(item);
    console.log(`Jadwal seeded: ${item.hari}`);
  }

  // 7. Seed PetugasJadwal (Model 8 - Many-to-Many junction)
  // Petugas 1 -> Jadwal 1 & Jadwal 2
  // Petugas 2 -> Jadwal 1 & Jadwal 3
  // Petugas 3 -> Jadwal 2 & Jadwal 3
  const assignments = [
    { petugasId: seededOfficers[0].id, jadwalId: seededSchedules[0].id },
    { petugasId: seededOfficers[0].id, jadwalId: seededSchedules[1].id },
    { petugasId: seededOfficers[1].id, jadwalId: seededSchedules[0].id },
    { petugasId: seededOfficers[1].id, jadwalId: seededSchedules[2].id },
    { petugasId: seededOfficers[2].id, jadwalId: seededSchedules[1].id },
    { petugasId: seededOfficers[2].id, jadwalId: seededSchedules[2].id },
  ];

  for (const assign of assignments) {
    await prisma.petugasJadwal.upsert({
      where: {
        petugasId_jadwalId: {
          petugasId: assign.petugasId,
          jadwalId: assign.jadwalId,
        },
      },
      update: {},
      create: assign,
    });
  }
  console.log("PetugasJadwal (Many-to-Many) seeded successfully.");

  // 8. Seed BankSampah (Model 9)
  const banks = [
    { namaBank: "Bank Sampah Sejahtera Pancoran", alamat: "Jl. Pancoran Barat No. 12", wilayahId: seededRegions[0].id },
    { namaBank: "Bank Sampah Mandiri Tebet", alamat: "Jl. Tebet Timur No. 45", wilayahId: seededRegions[1].id },
  ];

  const seededBanks: any[] = [];
  for (const b of banks) {
    const item = await prisma.bankSampah.upsert({
      where: { namaBank: b.namaBank },
      update: {},
      create: b,
    });
    seededBanks.push(item);
    console.log(`Bank Sampah seeded: ${item.namaBank}`);
  }

  // 9. Seed BankSampahJenis (Model 10 - Many-to-Many junction)
  // Bank 1 menerima Organik, Anorganik, Plastik Daur Ulang
  // Bank 2 menerima Anorganik, Kertas & Karton, Plastik Daur Ulang
  const bankPrices = [
    { bankSampahId: seededBanks[0].id, jenisSampahId: seededCategories[0].id, hargaPerKg: 1000 },
    { bankSampahId: seededBanks[0].id, jenisSampahId: seededCategories[1].id, hargaPerKg: 3000 },
    { bankSampahId: seededBanks[0].id, jenisSampahId: seededCategories[4].id, hargaPerKg: 4500 },
    { bankSampahId: seededBanks[1].id, jenisSampahId: seededCategories[1].id, hargaPerKg: 3200 },
    { bankSampahId: seededBanks[1].id, jenisSampahId: seededCategories[3].id, hargaPerKg: 2000 },
    { bankSampahId: seededBanks[1].id, jenisSampahId: seededCategories[4].id, hargaPerKg: 4200 },
  ];

  for (const bp of bankPrices) {
    await prisma.bankSampahJenis.upsert({
      where: {
        bankSampahId_jenisSampahId: {
          bankSampahId: bp.bankSampahId,
          jenisSampahId: bp.jenisSampahId,
        },
      },
      update: { hargaPerKg: bp.hargaPerKg },
      create: bp,
    });
  }
  console.log("BankSampahJenis (Many-to-Many) seeded successfully.");

  console.log("All 10 models seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
