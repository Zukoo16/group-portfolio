import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, DEMO_USER_ID } from "@/lib/auth";
import { parseProjectInput } from "@/lib/project-input";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

async function ownedProject(id: string, userId: string) {
  return prisma.project.findFirst({ where: { id, userId }, select: { id: true } });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ error: "Жүйеге кіріңіз." }, { status: 401 });
  }
  if (session.user.id === DEMO_USER_ID) {
    return NextResponse.json(
      { error: "Демо аккаунтта жобалар сақталмайды. MySQL қосып, нақты студент аккаунтын қолданыңыз." },
      { status: 503 },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Сұрау деректері дұрыс емес." }, { status: 400 });
  }

  const parsed = parseProjectInput(input);
  if (!parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { id } = await params;
  try {
    if (!(await ownedProject(id, session.user.id))) {
      return NextResponse.json({ error: "Жоба табылмады." }, { status: 404 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("PUT /api/projects/[id] failed:", error);
    return NextResponse.json(
      { error: "Жобаны жаңарту кезінде қате пайда болды." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ error: "Жүйеге кіріңіз." }, { status: 401 });
  }
  if (session.user.id === DEMO_USER_ID) {
    return NextResponse.json(
      { error: "Демо аккаунтта жобалар сақталмайды. MySQL қосып, нақты студент аккаунтын қолданыңыз." },
      { status: 503 },
    );
  }

  const { id } = await params;
  try {
    const project = await ownedProject(id, session.user.id);
    if (!project) {
      return NextResponse.json({ error: "Жоба табылмады." }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/projects/[id] failed:", error);
    return NextResponse.json(
      { error: "Жобаны өшіру кезінде қате пайда болды." },
      { status: 500 },
    );
  }
}
