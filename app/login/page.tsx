"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if redirected after successful registration using client-side URL parsing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setSuccess("Registrasi berhasil! Silakan masuk menggunakan email dan password baru Anda.");
      }
    }
  }, []);

  // Check if already authenticated, if yes redirect to admin/user
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            if (data.user.role === "ADMIN") {
              router.push("/admin");
            } else {
              router.push("/user");
            }
          }
        }
      } catch {}
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Coba lagi.");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
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

      <div className="w-full max-w-md relative z-10">
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

        {/* Login Card */}
        <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto sm:mx-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-4 text-zinc-800 dark:text-zinc-100">
              Portal Masuk
            </h1>
            <p className="text-sm text-zinc-500">
              Masukkan email dan password untuk mengakses dashboard pelaporan.
            </p>
          </div>

          {/* Success Notification */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/50 p-4 rounded-2xl text-rose-600 dark:text-rose-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email..."
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#121215] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-bold transition-all duration-200 shadow-md shadow-zinc-950/15 dark:shadow-emerald-500/15 mt-2 flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Menghubungkan...</span>
                </>
              ) : (
                "Masuk Ke Portal"
              )}
            </button>
          </form>

          <div className="text-center pt-2 flex flex-col gap-2">
            <span className="text-xs text-zinc-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Daftar di sini
              </Link>
            </span>
            <hr className="border-zinc-100 dark:border-zinc-800/30" />
            <span className="text-xs text-zinc-400">
              Akun Admin Seed: <code className="bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded">admin@ecoresik.com</code> / <code className="bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded">admin123</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
