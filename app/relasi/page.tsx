"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RelasiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeRelasi, setActiveRelasi] = useState<"1to1" | "1toN" | "NtoN">("1to1");

  useEffect(() => {
    async function fetchRelasiData() {
      try {
        setLoading(true);
        const res = await fetch("/api/relasi");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error("Gagal mengambil data relasi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRelasiData();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070708] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-[#070708]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-zinc-800 dark:text-zinc-100">
                EcoResik <span className="text-emerald-500">Relasi Database</span>
              </span>
              <span className="text-xs block text-zinc-500 font-medium -mt-1">
                Demonstrasi Relasi 1:1, 1:N, dan N:N PostgreSQL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/admin"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Admin Portal
            </Link>
            <Link
              href="/user"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              User Portal
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/10"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Banner Penjelasan */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-6 sm:p-8 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-fit">
            Sistem Database Relasional Tema Sampah
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Demonstrasi & Validasi Relasi Database
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
            Halaman ini mendemonstrasikan implementasi tiga jenis relasi utama pada database PostgreSQL: 
            <strong> One to One (1:1)</strong>, <strong>One to Many (1:N)</strong>, dan <strong>Many to Many (N:N)</strong> 
            lengkap dengan Foreign Key dan Unique Constraints sesuai ketentuan tugas ujian.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveRelasi("1to1")}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeRelasi === "1to1"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            1. Relasi One to One (1 to 1)
          </button>
          <button
            onClick={() => setActiveRelasi("1toN")}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeRelasi === "1toN"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            2. Relasi One to Many (1 to N)
          </button>
          <button
            onClick={() => setActiveRelasi("NtoN")}
            className={`py-3 px-5 font-bold text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeRelasi === "NtoN"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            3. Relasi Many to Many (N to N)
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-400 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm">Memuat data relasi database...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: ONE TO ONE */}
            {activeRelasi === "1to1" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold rounded-lg">
                      RELASI: ONE TO ONE (1:1)
                    </span>
                    <span className="text-xs text-zinc-500">Tabel LaporanSampah ↔ FotoSampah</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Satu Laporan Sampah Tepat Memiliki Satu Foto Bukti
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Relasi satu-ke-satu dipastikan oleh Foreign Key <code>laporanId</code> di tabel <code>FotoSampah</code> yang memiliki <strong>Constraint Unique (@unique)</strong>. 
                    Jika laporan dihapus, foto sampah terkait akan otomatis terhapus (<code>onDelete: Cascade</code>).
                  </p>
                </div>

                {/* Grid Bukti One to One */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.oneToOne && data.oneToOne.length > 0 ? (
                    data.oneToOne.map((lap: any) => (
                      <div key={lap.id} className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              Model: LaporanSampah (1)
                            </span>
                            <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100 mt-0.5">
                              {lap.jenisSampah?.namaJenis} — {lap.berat} Kg
                            </h3>
                            <p className="text-xs text-zinc-400 font-mono">ID: {lap.id}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
                            {lap.wilayah?.namaWilayah}
                          </span>
                        </div>

                        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-4 flex items-center gap-4">
                          <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0 border border-zinc-200/50 dark:border-zinc-800/50">
                            <Image
                              src={lap.fotoSampah?.imageUrl || "/uploads/placeholder.jpg"}
                              alt="Foto Bukti"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            <span className="font-bold text-purple-600 dark:text-purple-400 uppercase">
                              Model Terhubung: FotoSampah (1)
                            </span>
                            <span className="text-zinc-600 dark:text-zinc-400">
                              URL: <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{lap.fotoSampah?.imageUrl}</code>
                            </span>
                            <span className="text-zinc-500">
                              Foreign Key: <code className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">laporanId = {lap.fotoSampah?.laporanId?.slice(0, 13)}... (@unique)</code>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-8 text-center text-zinc-400 bg-white dark:bg-[#0d0d10] rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                      Belum ada laporan sampah terinput. Silakan buat laporan di portal /admin atau /user.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ONE TO MANY */}
            {activeRelasi === "1toN" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-mono text-xs font-bold rounded-lg">
                      RELASI: ONE TO MANY (1:N)
                    </span>
                    <span className="text-xs text-zinc-500">Tabel Wilayah (1) ↔ LaporanSampah (N) & User (1) ↔ LaporanSampah (N)</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Satu Wilayah / User Memiliki Banyak Laporan Sampah
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Setiap data pada tabel <code>Wilayah</code> atau <code>User</code> dapat merujuk ke nol, satu, atau banyak baris di tabel <code>LaporanSampah</code> melalui Foreign Key <code>wilayahId</code> dan <code>userId</code>.
                  </p>
                </div>

                {/* Grid Bukti One to Many per Wilayah */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data?.oneToMany?.map((wil: any) => (
                    <div key={wil.id} className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                            Model Induk (1): Wilayah
                          </span>
                          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                            {wil.namaWilayah}
                          </h3>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold">
                          {wil.laporan?.length || 0} Laporan (N)
                        </span>
                      </div>

                      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                          Daftar Laporan Terhubung (Foreign Key wilayahId):
                        </span>
                        {wil.laporan && wil.laporan.length > 0 ? (
                          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                            {wil.laporan.map((lap: any) => (
                              <div key={lap.id} className="py-2.5 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{lap.jenisSampah?.namaJenis}</span>
                                  <span className="text-zinc-400 block text-[10px]">Pelapor: {lap.user?.nama}</span>
                                </div>
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                  {lap.berat} Kg
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-4 text-center text-xs text-zinc-400 italic">
                            Belum ada laporan di wilayah ini (Relasi tetap valid 1 ke 0..N).
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MANY TO MANY */}
            {activeRelasi === "NtoN" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-mono text-xs font-bold rounded-lg">
                      RELASI: MANY TO MANY (N:N)
                    </span>
                    <span className="text-xs text-zinc-500">
                      Tabel Petugas (N) ↔ JadwalPengangkutan (N) & BankSampah (N) ↔ JenisSampah (N)
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Banyak Petugas Bertugas di Banyak Jadwal (via Tabel Perantara PetugasJadwal)
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Relasi Many-to-Many diimplementasikan dengan <strong>Junction Table</strong> (tabel penghubung):
                    <br />
                    1. <code>PetugasJadwal</code> menghubungkan tabel <code>Petugas</code> dengan <code>JadwalPengangkutan</code>.
                    <br />
                    2. <code>BankSampahJenis</code> menghubungkan tabel <code>BankSampah</code> dengan <code>JenisSampah</code>.
                  </p>
                </div>

                {/* Sub-Section 1: Petugas ke Banyak Jadwal */}
                <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Studi Kasus 1: Petugas ↔ JadwalPengangkutan (Many-to-Many)
                    </span>
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-1">
                      1 Petugas Bertugas di Banyak Jadwal, dan 1 Jadwal Dikerjakan oleh Banyak Petugas
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {data?.manyToManyOfficers?.map((pet: any) => (
                      <div key={pet.id} className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                            {pet.namaPetugas.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{pet.namaPetugas}</h4>
                            <span className="text-[11px] text-zinc-500">{pet.jabatan}</span>
                          </div>
                        </div>

                        <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-2 flex flex-col gap-1.5">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Jadwal yang Ditugaskan:
                          </span>
                          {pet.petugasJadwal?.map((pj: any) => (
                            <div key={pj.id} className="text-xs bg-white dark:bg-[#18181c] p-2 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between">
                              <span className="font-medium text-zinc-700 dark:text-zinc-300">{pj.jadwal?.hari}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{pj.jadwal?.jamOperasional}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-Section 2: Bank Sampah ke Banyak Jenis Sampah */}
                <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Studi Kasus 2: BankSampah ↔ JenisSampah (Many-to-Many via BankSampahJenis)
                    </span>
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-1">
                      1 Bank Sampah Menerima Banyak Jenis, dan 1 Jenis Sampah Diterima oleh Banyak Bank Sampah
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data?.manyToManyBanks?.map((bank: any) => (
                      <div key={bank.id} className="p-5 rounded-xl bg-[#fafafa] dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-base text-zinc-800 dark:text-zinc-200">{bank.namaBank}</h4>
                            <span className="text-xs text-zinc-500">{bank.alamat} ({bank.wilayah?.namaWilayah})</span>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">
                            Mitra Aktif
                          </span>
                        </div>

                        <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-2 flex flex-col gap-2">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Jenis Sampah yang Diterima & Tarif Pembelian:
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {bank.bankSampahJenis?.map((bsj: any) => (
                              <div key={bsj.id} className="bg-white dark:bg-[#18181c] p-2.5 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 flex flex-col">
                                <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{bsj.jenisSampah?.namaJenis}</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-0.5">
                                  Rp {bsj.hargaPerKg.toLocaleString("id-ID")} / Kg
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#070708] border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} EcoResik. Dokumentasi Relasi Database PostgreSQL.</p>
        </div>
      </footer>
    </div>
  );
}
