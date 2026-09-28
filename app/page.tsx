"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface JenisSampah {
  id: string;
  namaJenis: string;
}

interface Wilayah {
  id: string;
  namaWilayah: string;
}

interface User {
  id: string;
  nama: string;
  email: string;
}

interface FotoSampah {
  id: string;
  imageUrl: string;
}

interface LaporanSampah {
  id: string;
  berat: number;
  tanggalLapor: string;
  userId: string;
  user: User;
  jenisSampahId: string;
  jenisSampah: JenisSampah;
  wilayahId: string;
  wilayah: Wilayah;
  fotoSampah: FotoSampah | null;
}

export default function Home() {
  const [logs, setLogs] = useState<LaporanSampah[]>([]);
  const [categories, setCategories] = useState<JenisSampah[]>([]);
  const [regions, setRegions] = useState<Wilayah[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [logsRes, catRes, regRes] = await Promise.all([
          fetch("/api/sampah"),
          fetch("/api/jenis"),
          fetch("/api/wilayah"),
        ]);

        if (logsRes.ok) setLogs(await logsRes.json());
        if (catRes.ok) setCategories(await catRes.json());
        if (regRes.ok) setRegions(await regRes.json());
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedCategory ? log.jenisSampahId === selectedCategory : true;
    const matchesRegion = selectedRegion ? log.wilayahId === selectedRegion : true;
    const matchesSearch = searchTerm
      ? log.jenisSampah.namaJenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.wilayah.namaWilayah.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesRegion && matchesSearch;
  });

  // Calculate statistics
  const totalWeight = filteredLogs.reduce((acc, curr) => acc + curr.berat, 0);
  const totalRecords = filteredLogs.length;
  const uniqueRegionsCount = new Set(filteredLogs.map((log) => log.wilayahId)).size;

  // Category tags styling
  const getCategoryColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "organik":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
      case "anorganik":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50";
      case "b3":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
      case "kertas & karton":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070708] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-[#070708]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                EcoResik
              </span>
              <span className="text-xs block text-zinc-500 font-medium -mt-1">Pelaporan Sampah Masyarakat</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/relasi"
              className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200/50 dark:border-emerald-900/50 rounded-xl transition-all duration-200"
            >
              📊 Cek Relasi (1:1, 1:N, N:N)
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all duration-200 shadow-md shadow-zinc-950/10 dark:shadow-emerald-500/10 hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              Portal Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 max-w-2xl flex flex-col gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Ujian Praktik Mandiri
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Aplikasi Laporan Pengelolaan Sampah
            </h1>
            <p className="text-zinc-200 text-base md:text-lg">
              Sistem informasi pelaporan sampah terpadu yang mematuhi skema dan batasan database relasional (UUID PK, Unique NIK, Cascade, Restrict, & Hubungan 1-to-1).
            </p>
          </div>
        </section>

        {/* Dynamic Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Berat */}
          <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500 font-medium">Total Berat Sampah</span>
              <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                {loading ? "..." : `${totalWeight.toFixed(2)} Kg`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>

          {/* Card 2: Jumlah Data */}
          <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500 font-medium">Total Laporan Masuk</span>
              <span className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                {loading ? "..." : `${totalRecords} Laporan`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>

          {/* Card 3: Wilayah Aktif */}
          <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500 font-medium">Cakupan Wilayah</span>
              <span className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                {loading ? "..." : `${uniqueRegionsCount} Wilayah`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Filters and Main Grid */}
        <section className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filter Panel */}
          <aside className="w-full lg:w-72 bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-6 sticky lg:top-24">
            <div>
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Laporan
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Saring laporan sampah masyarakat</p>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="search" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cari Wilayah / Kategori</label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Ketik kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                />
                <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Jenis Sampah (FK)</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
              >
                <option value="">Semua Jenis</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.namaJenis}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="region" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Wilayah (FK)</label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
              >
                <option value="">Semua Wilayah</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.namaWilayah}
                  </option>
                ))}
              </select>
            </div>

            {(selectedCategory || selectedRegion || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedRegion("");
                  setSearchTerm("");
                }}
                className="w-full py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl text-xs font-semibold transition-colors text-zinc-600 dark:text-zinc-400"
              >
                Reset Filter
              </button>
            )}
          </aside>

          {/* Grid View of Records */}
          <div className="flex-1 w-full">
            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl h-80"></div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              /* Empty State */
              <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-700 dark:text-zinc-300">Tidak ada laporan</h3>
                  <p className="text-zinc-500 text-sm mt-1">Tidak ditemukan laporan sampah yang cocok dengan kriteria filter.</p>
                </div>
              </div>
            ) : (
              /* Card Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLogs.map((log) => (
                  <article
                    key={log.id}
                    className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:translate-y-[-2px] flex flex-col"
                  >
                    {/* Laporan Photo (One-to-One FotoSampah) */}
                    <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      <Image
                        src={log.fotoSampah?.imageUrl || "/uploads/placeholder.jpg"}
                        alt={`Bukti Laporan ${log.jenisSampah.namaJenis}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                      {/* Weight Badge on top of image */}
                      <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md text-white font-bold text-sm px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        {log.berat.toFixed(1)} Kg
                      </div>
                    </div>

                    {/* Waste Log Details */}
                    <div className="p-5 flex-1 flex flex-col gap-3 justify-between">
                      <div className="flex flex-col gap-2">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(log.jenisSampah.namaJenis)}`}>
                            {log.jenisSampah.namaJenis}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {log.wilayah.namaWilayah}
                          </span>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Oleh {log.user.nama}
                        </span>
                        <time dateTime={log.tanggalLapor}>
                          {new Date(log.tanggalLapor).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#070708] border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} EcoResik. Aplikasi Laporan Sampah Masyarakat.</p>
        </div>
      </footer>
    </div>
  );
}
