import { prisma } from "@/lib/prisma";

export async function getStudents() {
  try {
    return await prisma.user.findMany({
      where: { role: "student" },
      select: { id: true, name: true, bio: true, _count: { select: { projects: true } } },
      orderBy: { name: "asc" },
    });
  } catch {
    return null;
  }
}

export async function getWishes() {
  try {
    const wishes = await prisma.wish.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 60,
      select: { id: true, message: true, userId: true, createdAt: true, user: { select: { name: true } } },
    });
    return wishes.map((wish) => ({ ...wish, createdAt: wish.createdAt.toISOString() }));
  } catch {
    return null;
  }
}
