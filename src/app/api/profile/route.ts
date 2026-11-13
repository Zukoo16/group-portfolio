import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, DEMO_USER_ID } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function validUrl(value: unknown): value is string | null {
  if (value === null || value === "") return true;
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ error: "Жүйеге кіріңіз." }, { status: 401 });
  }
  if (session.user.id === DEMO_USER_ID) {
    return NextResponse.json(
      { error: "Демо аккаунтта профиль өзгерістері сақталмайды. MySQL қосыңыз." },
      { status: 503 },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Сұрау деректері дұрыс емес." }, { status: 400 });
  }

  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "Профиль деректері дұрыс емес." }, { status: 400 });
  }

  const values = input as Record<string, unknown>;
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const bio = typeof values.bio === "string" ? values.bio.trim() : "";
  const githubUrl = values.githubUrl === "" ? null : values.githubUrl;
  if (!name || name.length > 100 || bio.length > 500 || !validUrl(githubUrl)) {
    return NextResponse.json(
      { error: "Аты-жөні, сипаттамасы немесе GitHub сілтемесі дұрыс емес." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, bio: bio || null, githubUrl },
      select: { id: true, name: true, email: true, bio: true, githubUrl: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH /api/profile failed:", error);
    return NextResponse.json(
      { error: "Профильді сақтау кезінде қате пайда болды." },
      { status: 500 },
    );
  }
}
