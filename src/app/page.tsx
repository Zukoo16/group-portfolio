import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Heart, Sparkles } from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import type { PublicProject } from "@/components/project-card";
import { getStudents, getWishes } from "@/lib/community";
import { WishBoard } from "@/components/wish-board";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProjects(): Promise<PublicProject[] | null> {
  try {
    const records = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, githubUrl: true } } },
    });
    return records.map((project) => ({ ...project,
      techStack: Array.isArray(project.techStack) ? project.techStack.filter((item): item is string => typeof item === "string") : [],
      createdAt: project.createdAt.toISOString(),
    }));
  } catch {
    if (process.env.NODE_ENV === "development" && process.env.DEMO_LOGIN_EMAIL) {
      return [{
        id: "demo-project-preview", title: "Студенттік жобалар портфолиосы",
        description: "Бұл — галереяның көрінісін таныстыратын үлгі. Нақты студенттердің жобалары дерекқор қосылғанда көрсетіледі.",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS"], liveUrl: null, githubUrl: null,
        createdAt: new Date().toISOString(), user: { name: "Үлгі автор", githubUrl: null }, isDemoPreview: true,
      }];
    }
    return null;
  }
}

export default async function Home() {
  const [projects, students, wishes] = await Promise.all([getProjects(), getStudents(), getWishes()]);
  return (
    <main className="group-home">
      <section className="community-hero">
        <div className="hero-copy">
          <span className="hero-pill"><span className="size-2 rounded-full bg-emerald-500" /> ИСАИ-25-1 · Біздің кішкентай әлем</span>
          <h1>Бірге оқимыз.<br />Бірге <span className="hero-highlight">естелік</span><br />жинаймыз<span className="text-orange-500"> :)</span></h1>
          <p>Код жазамыз, бір-бірімізге көмектесеміз, арасында күліп те аламыз. Бұл — біздің топ, біздің жобалар және бірге өткен сәттер.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="#students" className="warm-button">Біздің топпен таныс <ArrowUpRight size={17} /></Link><Link href="#projects" className="soft-button">Жобаларға көз сал <ArrowDown size={16} /></Link></div>
          <div className="hero-footnote"><Heart size={15} className="text-orange-500" /> Қорқыт Ата университетінен, жылылықпен.</div>
        </div>
        <figure className="hero-photo-wrap">
          <span className="photo-tape" aria-hidden="true" />
          <div className="hero-photo"><Image src="/team-photo.jpeg" alt="ИСАИ-25-1 тобының бірге түскен суреті" fill priority sizes="(max-width: 900px) 90vw, 48vw" className="object-cover object-[center_62%]" /></div>
          <figcaption><span>Біздің адамдар ♡</span><span className="text-xs font-normal text-stone-500">ИСАИ-25-1</span></figcaption>
          <span className="photo-sticker" aria-hidden="true">бір топ,<br />көп оқиға ✨</span>
        </figure>
      </section>
      <div className="group-ribbon" aria-hidden="true"><span>Код та бар</span><span>✳</span><span>Күлкі де бар</span><span>✳</span><span>Бәріміз біргеміз</span><span>✳</span><span>ИСАИ-25-1</span><span>✳</span><span>Код та бар</span></div>
      <section id="life" className="community-section scroll-mt-24">
        <div className="section-topline"><span className="eyebrow">01 / Сабақтан тыс та өмір бар</span><Sparkles size={23} /></div>
        <div className="section-intro"><div><h2>Топтың өз атмосферасы<span className="text-orange-500">.</span></h2><p>Ең жақсы естеліктер — бірге болған сәттер.</p></div><span className="little-sticker">Біздің vibe ☀️</span></div>
        <div className="life-grid">
          <figure className="life-photo"><Image src="/team-photo.jpeg" alt="Біздің топтың ортақ естелігі" fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover object-[center_62%]" /><figcaption>Бір кадрда — қанша әңгіме.</figcaption></figure>
          <div className="life-notes"><article className="life-note note-lilac"><span className="text-3xl" aria-hidden="true">💻</span><h3>«Мына код неге жүрмейді?»</h3><p>Бірге үйрену, ой бөлісу, бір шешімге қуану. Жобаларымыз осы жерден басталады.</p><a href="#projects">Не жасап жүрміз? ↗</a></article><article className="life-note note-yellow"><span className="text-3xl" aria-hidden="true">☕</span><h3>Тек дедлайнмен өмір сүрмейміз</h3><p>Үзілістегі әңгіме, ортақ фото, кішкентай қолдау. Топты топ ететін де сол.</p><a href="#wishes">Бір жылы сөз қалдыр ↗</a></article></div>
        </div>
      </section>
      <section id="students" className="community-section students-section scroll-mt-24">
        <div className="section-topline"><span className="eyebrow">02 / Әрқайсымыз — бір әлем</span><span className="text-sm text-stone-500">{students ? students.length + " студент" : "Біздің топ"}</span></div>
        <div className="section-intro"><div><h2>Таныс бол, біздің топ<span className="text-orange-500">!</span></h2><p>Өз мінезі, өз қызығушылығы, өз идеясы бар адамдар.</p></div></div>
        {students === null ? <p className="empty-community">Студенттерді қазір жүктей алмадық. Сәлден кейін қайта кіріп көр.</p> : students.length === 0 ? <p className="empty-community">Топ мүшелерінің парақшалары осында пайда болады.</p> : <div className="student-grid">{students.map((student, index) => <Link href={`/students/${student.id}`} key={student.id} className="student-card"><div className="flex items-start justify-between"><span className={`student-avatar avatar-${index % 4}`}>{student.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><ArrowUpRight size={19} className="text-stone-400" /></div><h3>{student.name}</h3><p>{student.bio || "Мінездемесі әлі жазылмады. Жақында өзімен жақынырақ танысамыз :)"}</p><span className="student-project-count">{student._count.projects} жоба · Портфолионы ашу ↗</span></Link>)}</div>}
      </section>
      <section id="projects" className="community-section scroll-mt-24">
        <div className="section-topline"><span className="eyebrow">03 / Идеядан — дайын жобаға</span><span className="little-sticker">{projects?.length ?? 0} жоба 🚀</span></div>
        <div className="section-intro"><div><h2>Өзіміз жасадық<span className="text-orange-500">.</span></h2><p>Үлкен-кіші идеяларымыз осында. Кіріп көр, авторымен таныс.</p></div></div>
        <div className="project-rule"><span aria-hidden="true">🌐</span><div><strong>Әр жобаның өз мекені бар</strong><p>Жариялау шарты: үшінші деңгейлі домен. Мысалы, <code>student.vercel.app</code> немесе <code>project.example.kz</code>.</p></div></div>
        {projects === null ? <p className="empty-community">Жобалар қазір жүктелмеді. Сәлден кейін тағы көріп шық.</p> : projects.length ? <ProjectGallery projects={projects} /> : <div className="empty-community"><p className="text-xl font-bold">Алғашқы жобаны күтіп отырмыз 🚀</p><p className="mt-2">Кабинетке кіріп, өз жұмысыңды қос.</p><Link href="/dashboard" className="warm-button mt-5">Жоба қосу <ArrowUpRight size={16} /></Link></div>}
      </section>
      <WishBoard initialWishes={wishes} />
      <footer className="community-footer"><Link href="/" className="font-extrabold text-xl">ИСАИ-25-1<span className="text-orange-500"> ♡</span></Link><p>Бірге жасағанның бәрі — естелік.</p><span>© 2026 · Қорқыт Ата университеті</span></footer>
    </main>
  );
}
