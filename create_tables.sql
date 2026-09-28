CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "Petugas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "namaPetugas" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    CONSTRAINT "Petugas_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Petugas_noHp_key" UNIQUE ("noHp")
);

CREATE TABLE IF NOT EXISTS "JadwalPengangkutan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hari" TEXT NOT NULL,
    "jamOperasional" TEXT NOT NULL,
    "wilayahId" UUID NOT NULL,
    CONSTRAINT "JadwalPengangkutan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "JadwalPengangkutan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PetugasJadwal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "petugasId" UUID NOT NULL,
    "jadwalId" UUID NOT NULL,
    CONSTRAINT "PetugasJadwal_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PetugasJadwal_petugasId_jadwalId_key" UNIQUE ("petugasId", "jadwalId"),
    CONSTRAINT "PetugasJadwal_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PetugasJadwal_jadwalId_fkey" FOREIGN KEY ("jadwalId") REFERENCES "JadwalPengangkutan"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BankSampah" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "namaBank" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "wilayahId" UUID NOT NULL,
    CONSTRAINT "BankSampah_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BankSampah_namaBank_key" UNIQUE ("namaBank"),
    CONSTRAINT "BankSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BankSampahJenis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bankSampahId" UUID NOT NULL,
    "jenisSampahId" UUID NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "BankSampahJenis_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BankSampahJenis_bankSampahId_jenisSampahId_key" UNIQUE ("bankSampahId", "jenisSampahId"),
    CONSTRAINT "BankSampahJenis_bankSampahId_fkey" FOREIGN KEY ("bankSampahId") REFERENCES "BankSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BankSampahJenis_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
