"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !noHp || !nik || !password) {
      setError("Semua kolom input wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, noHp, nik, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal. Silakan coba lagi.");
      }

      // Redirect to login page on success
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070708] text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Glow Decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-6 group"
        >
          <svg
            className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Dashboard Publik
        </Link>

        {/* Register Card */}
        <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto sm:mx-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-4 text-zinc-800 dark:text-zinc-100">
              Registrasi Warga
            </h1>
            <p className="text-sm text-zinc-500">
              Buat akun baru untuk mengirim laporan sampah masyarakat.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/50 p-4 rounded-2xl text-rose-600 dark:text-rose-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nama" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap..."
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>

            {/* NIK */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nik" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                id="nik"
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Masukkan NIK 16 digit..."
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>

            {/* No HP */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="noHp" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Nomor HP
              </label>
              <input
                id="noHp"
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="Contoh: 0812xxxxxx"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password..."
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password..."
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-bold transition-all duration-200 shadow-md shadow-zinc-950/15 dark:shadow-emerald-500/15 mt-2 flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-zinc-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
