import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  CodeXml,
  Layers3,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import type { PublicProject } from "@/components/project-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProjects(): Promise<{
  projects: PublicProject[];
  unavailable: boolean;
  demoPreview: boolean;
}> {
  try {
    const records = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, githubUrl: true } } },
    });

    return {
      projects: records.map((project) => ({
        ...project,
        techStack: Array.isArray(project.techStack)
          ? project.techStack.filter(
              (technology): technology is string => typeof technology === "string",
            )
          : [],
        createdAt: project.createdAt.toISOString(),
      })),
      unavailable: false,
      demoPreview: false,
    };
  } catch (error) {
    console.warn("Could not load projects for the home page:", error);
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DEMO_LOGIN_EMAIL
    ) {
      return {
        projects: [
          {
            id: "demo-project-preview",
            title: "Студенттік жобалар портфолиосы",
            description:
              "Университет студенттерінің IT жобаларын бір жерге жинайтын веб-платформа. Мұнда әр студент жобасының сипаттамасын, технологияларын және GitHub не демо сілтемесін жариялай алады.",
            techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
            liveUrl: null,
            githubUrl: null,
            createdAt: new Date().toISOString(),
            user: { name: "Rakhymbai Demezhan", githubUrl: null },
            isDemoPreview: true,
          },
        ],
        unavailable: false,
        demoPreview: true,
      };
    }

    return { projects: [], unavailable: true, demoPreview: false };
  }
}

export default async function Home() {
  const { projects, unavailable, demoPreview } = await getProjects();

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_15%,rgba(37,99,235,0.28),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(79,70,229,0.18),transparent_34%)]" />
        <div className="absolute -right-36 top-14 -z-10 size-[34rem] rounded-full border border-white/[0.06]" />
        <div className="absolute -right-12 top-36 -z-10 size-[22rem] rounded-full border border-white/[0.08]" />

        <div className="mx-auto grid min-h-[580px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-100">
              <Sparkles size={15} className="text-blue-300" />
              Практика · 2-курс студенттері
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Information Systems Team
              <span className="mt-3 block text-blue-300">
                Ideas we build together.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Болашақ IT мамандарының жобалары, хакатон шешімдері және ізденістері
              бір алаңда. Біздің еңбектерімізбен танысып, жаңа идеяларға шабыт
              алыңыз.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                Жобаларды көру <ArrowDown size={17} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Студентке кіру <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-indigo-500/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                  <Code2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Біздің бағыт</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Оқу · тәжірибе · нәтиже
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 py-6">
                <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-4">
                  <UsersRound size={19} className="text-blue-300" />
                  <p className="mt-4 text-2xl font-bold">{projects.length}</p>
                  <p className="mt-1 text-xs text-slate-400">жоба жарияланды</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-4">
                  <Layers3 size={19} className="text-indigo-300" />
                  <p className="mt-4 text-2xl font-bold">2026</p>
                  <p className="mt-1 text-xs text-slate-400">практика жылы</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-4">
                <p className="text-sm leading-6 text-blue-50">
                  «Әрбір үлкен шешім бір жақсы идеядан басталады.»
                </p>
                <p className="mt-3 text-xs font-medium text-blue-200">
                  — Ақпараттық жүйелер тобы
                </p>
              </div>
            </div>
          </div>
        </div>
        <a
          href="#projects"
          aria-label="Жобаларға өту"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/50 transition hover:text-white sm:block"
        >
          <ArrowDown size={19} />
        </a>
      </section>

      <section
        aria-labelledby="team-heading"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 text-center sm:mb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Біздің команда
            </p>
            <h2
              id="team-heading"
              className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
            >
              Бір топ. Бір мақсат.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Қорқыт Ата университетіндегі ақпараттық жүйелер тобы — бірге
              үйреніп, бірге дамып келе жатқан болашақ IT мамандары.
            </p>
          </div>
          <figure className="relative isolate mx-auto aspect-[4/3] max-w-5xl overflow-hidden rounded-3xl bg-slate-200 shadow-xl shadow-slate-900/10 sm:aspect-[16/8] lg:aspect-[16/7]">
            <Image
              src="/team-photo.jpeg"
              alt="Қорқыт Ата университетінің ақпараттық жүйелер тобының студенттері бірге түскен сурет"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1024px"
              className="object-cover object-[center_62%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 text-white sm:p-8">
              <span className="text-lg font-bold sm:text-2xl">
                Ақпараттық жүйелер тобы
              </span>
              <span className="text-sm text-white/80">
                Қорқыт Ата атындағы Қызылорда университеті
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="projects" className="scroll-mt-24 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Біздің жұмыстар
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Студенттік жобалар
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Практика барысында жасалған веб-қосымшалар, цифрлық өнімдер мен
                шығармашылық шешімдер.
              </p>
              {demoPreview && (
                <p className="mt-3 text-xs font-medium text-amber-700">
                  Көрсетілген карточка — тек танысуға арналған үлгі, дерекқорға
                  жарияланбаған.
                </p>
              )}
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-500" />
              {projects.length} жоба
            </div>
          </div>

          {unavailable ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
              <p className="font-semibold text-amber-950">
                Дерекқорға қосылу мүмкін болмады
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                MySQL серверін қосып, DATABASE_URL баптауын тексеріңіз. Жобалар
                жүктелгеннен кейін осы жерде көрінеді.
              </p>
            </div>
          ) : projects.length > 0 ? (
            <ProjectGallery projects={projects} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Layers3 size={22} />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">
                Әзірге жарияланған жоба жоқ
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Студенттер алғашқы жұмыстарын жүктегенде осында көрсетіледі.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-lg font-bold text-slate-950">
              Жобаңызды ортаға салуға дайынсыз ба?
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Кабинетке кіріп, жұмысыңызды топ портфолиосына қосыңыз.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Кабинетке өту <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Ақпараттық жүйелер тобы. Қорқыт Ата университеті.</p>
          <a
            href="https://github.com/Zukoo16"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <CodeXml size={16} /> Демежанның GitHub парақшасы
          </a>
        </div>
      </footer>
    </main>
  );
}
