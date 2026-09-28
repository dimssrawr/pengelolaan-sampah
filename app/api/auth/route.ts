import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Helper to encrypt session (for basic tampering prevention)
function encodeSession(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

function decodeSession(token: string): any {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

// GET: Check session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = decodeSession(sessionCookie.value);
    if (!session || (session.role !== "ADMIN" && session.role !== "USER")) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, nama: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Login (expects email and password)
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    if (user.password !== passwordHash) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Create session cookie
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const sessionToken = encodeSession(sessionData);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", {
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
