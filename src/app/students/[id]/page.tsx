import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectGallery } from "@/components/project-gallery";

export const dynamic = "force-dynamic";

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await prisma.user.findFirst({
    where: { id, role: "student" },
    select: { id: true, name: true, bio: true, githubUrl: true, projects: { orderBy: { createdAt: "desc" }, select: { id: true, title: true, description: true, techStack: true, liveUrl: true, githubUrl: true, createdAt: true } } },
  }).then((student) => ({ student, failed: false })).catch(() => ({ student: null, failed: true }));
  if (result.failed) return <main className="community-section"><Link href="/#students" className="soft-button"><ArrowLeft size={16} /> Топқа оралу</Link><h1 className="mt-8 text-3xl font-bold">Портфолио қазір жүктелмеді</h1><p className="mt-4 text-stone-600">Сәлден кейін қайта кіріп көр.</p></main>;
  if (!result.student) notFound();
  const student = result.student;
  const projects = student.projects.map((project) => ({ ...project, createdAt: project.createdAt.toISOString(), techStack: Array.isArray(project.techStack) ? project.techStack.filter((item): item is string => typeof item === "string") : [], user: { id: student.id, name: student.name, githubUrl: student.githubUrl } }));
  return <main className="group-home min-h-screen"><section className="community-section">
    <Link href="/#students" className="soft-button"><ArrowLeft size={16} /> Біздің топ</Link>
    <div className="student-profile mt-8"><span className="student-avatar avatar-1">{student.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><p className="eyebrow">ИСАИ-25-1 · Жеке портфолио</p><h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">{student.name}</h1><h2 className="mt-7 text-sm font-bold">Өзім туралы</h2><p className="mt-2 max-w-2xl whitespace-pre-wrap break-words leading-7 text-stone-600">{student.bio || "Мінездемемді жақында қосамын. Әзірге жобаларымды көріп шық :)"}</p>{student.githubUrl && <a href={student.githubUrl} target="_blank" rel="noreferrer" className="soft-button mt-5">GitHub <ArrowUpRight size={16} /></a>}</div></div>
    <div className="section-intro mt-16"><div><h2>Менің жобаларым<span className="text-orange-500">.</span></h2><p>{projects.length} жоба · Әр идеяның өз тарихы бар.</p></div></div>
    {projects.length ? <ProjectGallery projects={projects} /> : <div className="empty-community">Алғашқы жобамды осында қосамын. Күте тұр 🚀</div>}
  </section></main>;
}
