import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, DEMO_USER_ID } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWishes } from "@/lib/community";

export const runtime = "nodejs";

export async function GET() {
  const wishes = await getWishes();
  return wishes ? NextResponse.json(wishes) : NextResponse.json({ error: "Тілектерді жүктеу мүмкін болмады." }, { status: 503 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id || session.user.role !== "student") {
    return NextResponse.json({ error: "Тілек жазу үшін жүйеге кіріңіз." }, { status: 401 });
  }
  if (session.user.id === DEMO_USER_ID) {
    return NextResponse.json({ error: "Демо аккаунтта тілек сақталмайды." }, { status: 503 });
  }
  let input: unknown;
  try { input = await request.json(); } catch {
    return NextResponse.json({ error: "Сұрау дұрыс емес." }, { status: 400 });
  }
  const message = input && typeof input === "object" && "message" in input && typeof input.message === "string" ? input.message.trim() : "";
  if (!message || message.length > 500) {
    return NextResponse.json({ error: "Тілек 1–500 таңба аралығында болсын." }, { status: 400 });
  }
  try {
    const wish = await prisma.wish.create({
      data: { message, userId: session.user.id },
      select: { id: true, message: true, userId: true, createdAt: true, user: { select: { name: true } } },
    });
    return NextResponse.json(wish, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Тілек сақталмады. Кейінірек қайталап көріңіз." }, { status: 503 });
  }
}
