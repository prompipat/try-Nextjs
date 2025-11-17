import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/lib/prisma";

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "Email and password are required",
      },
      {
        status: 400,
      }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User alresdy exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
