import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, DEMO_USER_ID } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient, type DashboardProject } from "@/components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    redirect("/login");
  }

  let projects: DashboardProject[] = [];
  let profile = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    bio: "",
    githubUrl: "",
  };
  let databaseError = false;

  if (session.user.id === DEMO_USER_ID) {
    databaseError = true;
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { projects: { orderBy: { createdAt: "desc" } } },
      });

      if (user) {
        profile = {
          name: user.name,
          email: user.email,
          bio: user.bio ?? "",
          githubUrl: user.githubUrl ?? "",
        };
        projects = user.projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          techStack: Array.isArray(project.techStack)
            ? project.techStack.filter(
                (technology): technology is string => typeof technology === "string",
              )
            : [],
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          createdAt: project.createdAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn("Could not load student dashboard:", error);
      databaseError = true;
    }
  }

  return (
    <DashboardClient
      initialProjects={projects}
      initialProfile={profile}
      databaseError={databaseError}
    />
  );
}
