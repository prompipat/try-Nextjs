import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/lib/auth";
import { prisma } from "@/prisma/lib/prisma";
import type { Image as PrismaImage } from "@prisma/client";

export async function GET() {
  // now that Prisma client is regenerated, include works and is properly typed
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { title, data } = body as { title?: string; data?: string };

  if (!data) {
    return NextResponse.json(
      { error: "Image data is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const image = await prisma.image.create({
    data: {
      userId: user.id,
      data,
      title: title ?? null,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
