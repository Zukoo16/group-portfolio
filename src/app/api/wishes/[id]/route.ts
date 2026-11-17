import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, DEMO_USER_ID } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id || session.user.role !== "student" || session.user.id === DEMO_USER_ID) {
    return NextResponse.json({ error: "Жүйеге кіріңіз." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const result = await prisma.wish.deleteMany({ where: { id, userId: session.user.id } });
    return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Тілек табылмады немесе сізге тиесілі емес." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Тілекті өшіру мүмкін болмады." }, { status: 503 });
  }
}
