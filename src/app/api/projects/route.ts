import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, DEMO_USER_ID } from "@/lib/auth";
import { parseProjectInput } from "@/lib/project-input";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, githubUrl: true } },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects failed:", error);
    return NextResponse.json(
      { error: "Жобаларды жүктеу кезінде қате пайда болды." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

  try {
    const project = await prisma.project.create({
      data: { ...parsed.data, userId: session.user.id },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects failed:", error);
    return NextResponse.json(
      { error: "Жобаны сақтау кезінде қате пайда болды." },
      { status: 500 },
    );
  }
}
