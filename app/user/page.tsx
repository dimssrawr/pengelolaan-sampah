"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  role: string;
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

export default function UserDashboard() {
  const router = useRouter();
  const [citizenUser, setCitizenUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data states
  const [logs, setLogs] = useState<LaporanSampah[]>([]);
  const [categories, setCategories] = useState<JenisSampah[]>([]);
  const [regions, setRegions] = useState<Wilayah[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Forms states
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Laporan Form State
  const [editingLaporanId, setEditingLaporanId] = useState<string | null>(null);
  const [berat, setBerat] = useState("");
  const [jenisSampahId, setJenisSampahId] = useState("");
  const [wilayahId, setWilayahId] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth protection
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoadingAuth(true);
        const res = await fetch("/api/auth");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data && data.authenticated) {
          if (data.user.role === "ADMIN") {
            router.push("/admin");
            return;
          }
          setCitizenUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  // Fetch all data (citizen logs + metadata)
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [logsRes, catRes, regRes] = await Promise.all([
        fetch("/api/sampah?myOnly=true"),
        fetch("/api/jenis"),
        fetch("/api/wilayah"),
      ]);

      if (logsRes.ok) setLogs(await logsRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (regRes.ok) setRegions(await regRes.json());
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (citizenUser) {
      fetchData();
    }
  }, [citizenUser]);

  // Toast message timeouts
  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", { method: "DELETE" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  // Reset forms helper
  const resetLaporanForm = () => {
    setEditingLaporanId(null);
    setBerat("");
    setJenisSampahId("");
    setWilayahId("");
    setFotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit Laporan (Create / Update)
  const handleLaporanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!berat || !jenisSampahId || !wilayahId) {
      setErrorMsg("Harap isi berat, jenis, dan wilayah!");
      return;
    }
    if (!editingLaporanId && !fotoFile) {
      setErrorMsg("Harap unggah foto bukti sampah!");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      
      const formData = new FormData();
      formData.append("berat", berat);
      formData.append("jenisSampahId", jenisSampahId);
      formData.append("wilayahId", wilayahId);
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      const url = editingLaporanId ? `/api/sampah?id=${editingLaporanId}` : "/api/sampah";
      const method = editingLaporanId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan laporan.");
      }

      setSuccessMsg(editingLaporanId ? "Laporan berhasil diperbarui!" : "Laporan sampah berhasil ditambahkan!");
      resetLaporanForm();
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Laporan
  const handleLaporanDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan sampah ini? (Foto juga akan ikut terhapus karena Cascade)")) return;

    try {
      const res = await fetch(`/api/sampah?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus.");
      }

      setSuccessMsg("Laporan berhasil dihapus!");
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Start Edit Laporan
  const startLaporanEdit = (log: LaporanSampah) => {
    setEditingLaporanId(log.id);
    setBerat(log.berat.toString());
    setJenisSampahId(log.jenisSampahId);
    setWilayahId(log.wilayahId);
    setFotoFile(null); // Optional new photo
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#070708] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-zinc-500 font-medium">Memeriksa Otorisasi Warga...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070708] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Header Panel */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-[#070708]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-zinc-800 dark:text-zinc-100">
                EcoResik <span className="text-emerald-500">Portal Laporan Warga</span>
              </span>
              <span className="text-xs block text-zinc-500 font-medium -mt-1">
                Halo, {citizenUser?.nama || "User"} (Masyarakat)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Lihat Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 rounded-xl transition-all duration-200"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Notification Toast */}
      {errorMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm animate-bounce">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs font-semibold">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Section */}
          <section className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                {editingLaporanId ? "Ubah Laporan Sampah" : "Kirim Laporan Sampah Baru"}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Patuhi Validasi: Berat &gt; 0 kg dan Foto bukti wajib disertakan (Transactional 1-to-1).
              </p>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <form onSubmit={handleLaporanSubmit} className="flex flex-col gap-4">
              {/* Weight Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sampah-berat" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Berat Sampah (Kg)</label>
                <input
                  id="sampah-berat"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Contoh: 15.3"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>

              {/* Category Select (Foreign Key relation to JenisSampah) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sampah-jenis" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Jenis Sampah (FK)</label>
                <select
                  id="sampah-jenis"
                  value={jenisSampahId}
                  onChange={(e) => setJenisSampahId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                  required
                >
                  <option value="">Pilih Jenis...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.namaJenis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Select (Foreign Key relation to Wilayah) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sampah-wilayah" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Wilayah (FK)</label>
                <select
                  id="sampah-wilayah"
                  value={wilayahId}
                  onChange={(e) => setWilayahId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                  required
                >
                  <option value="">Pilih Wilayah...</option>
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.namaWilayah}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload (1-to-1 FotoSampah) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sampah-foto" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Foto Bukti (1-to-1)</label>
                <input
                  id="sampah-foto"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950/30 dark:file:text-emerald-400 file:transition-colors"
                  required={!editingLaporanId}
                />
                {editingLaporanId && (
                  <p className="text-[10px] text-zinc-400 italic">Biarkan kosong jika tidak ingin mengubah foto</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 transition-colors"
                >
                  {submitting ? "Mengirim..." : "Kirim Laporan"}
                </button>
                {editingLaporanId && (
                  <button
                    type="button"
                    onClick={resetLaporanForm}
                    className="px-4 py-2.5 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-500 transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* List / Table Section */}
          <section className="lg:col-span-2 bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-900">
              <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                Daftar Laporan Sampah Saya
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Hanya menampilkan laporan yang dikirim oleh Anda (UUID format).</p>
            </div>

            {loadingData ? (
              <div className="p-12 text-center text-zinc-400">Loading data...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-sm">Belum ada laporan sampah terdaftar.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                      <th className="px-6 py-3.5">Foto Bukti</th>
                      <th className="px-6 py-3.5">Kategori</th>
                      <th className="px-6 py-3.5">Berat</th>
                      <th className="px-6 py-3.5">Lokasi & Pelapor</th>
                      <th className="px-6 py-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                            <Image
                              src={log.fotoSampah?.imageUrl || "/uploads/placeholder.jpg"}
                              alt="Foto sampah"
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">{log.jenisSampah.namaJenis}</span>
                            <span className="text-[10px] text-zinc-400 font-mono select-all">UUID Laporan: {log.id.slice(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                          {log.berat} Kg
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5 text-xs text-zinc-500">
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">{log.wilayah.namaWilayah}</span>
                            <span>Pelapor: {log.user.nama}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startLaporanEdit(log)}
                              className="w-8 h-8 rounded-lg border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors"
                              title="Ubah"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleLaporanDelete(log.id)}
                              className="w-8 h-8 rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400 transition-colors"
                              title="Hapus"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#070708] border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} EcoResik. Portal Pelaporan Warga.</p>
        </div>
      </footer>
    </div>
  );
}
