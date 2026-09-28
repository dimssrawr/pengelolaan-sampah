import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { nama, email, noHp, nik, password } = await req.json();

    // Validasi input
    if (!nama || !email || !noHp || !nik || !password) {
      return NextResponse.json(
        { error: "Semua kolom input wajib diisi" },
        { status: 400 }
      );
    }

    // Soal 5: Validasi email format dasar
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // 1. Check Unique Email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 400 }
      );
    }

    // 2. Check Unique noHp
    const existingNoHp = await prisma.user.findUnique({
      where: { noHp },
    });
    if (existingNoHp) {
      return NextResponse.json(
        { error: "Nomor HP sudah terdaftar. Silakan gunakan nomor lain." },
        { status: 400 }
      );
    }

    // 3. Check Unique NIK
    const existingNik = await prisma.user.findUnique({
      where: { nik },
    });
    if (existingNik) {
      return NextResponse.json(
        { error: "NIK sudah terdaftar. Silakan gunakan NIK lain." },
        { status: 400 }
      );
    }

    // Hash password using SHA-256
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    // Create User record in PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        noHp,
        nik,
        password: passwordHash,
        role: "USER", // Default role is USER (citizen)
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          nama: newUser.nama,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
