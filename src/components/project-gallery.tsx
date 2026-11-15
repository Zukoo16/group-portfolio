"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProjectCard, type PublicProject } from "@/components/project-card";

type SortOrder = "newest" | "oldest";

export function ProjectGallery({ projects }: { projects: PublicProject[] }) {
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const technologies = useMemo(
    () =>
      Array.from(
        new Map(
          projects.flatMap((project) =>
            project.techStack.map((item) => [item.toLocaleLowerCase(), item] as const),
          ),
        ).values(),
      ).sort((left, right) => left.localeCompare(right)),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const normalizedTechnology = technology.toLocaleLowerCase();

    return projects
      .filter((project) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            project.title,
            project.description,
            project.user.name,
            ...project.techStack,
          ]
            .join(" ")
            .toLocaleLowerCase()
            .includes(normalizedQuery);
        const matchesTechnology =
          !normalizedTechnology ||
          project.techStack.some(
            (item) => item.toLocaleLowerCase() === normalizedTechnology,
          );

        return matchesQuery && matchesTechnology;
      })
      .sort((left, right) => {
        const dateDifference =
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        return sortOrder === "newest" ? dateDifference : -dateDifference;
      });
  }, [projects, query, technology, sortOrder]);

  const hasFilters = query.trim().length > 0 || technology.length > 0;

  function clearFilters() {
    setQuery("");
    setTechnology("");
  }

  return (
    <>
      <div className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.42fr)_minmax(150px,0.35fr)] sm:p-4">
        <label className="relative block">
          <span className="sr-only">Жобалардан іздеу</span>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Жоба, автор немесе технология..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Технология бойынша сүзу</span>
          <SlidersHorizontal
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">Барлық технологиялар</option>
            {technologies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Жобаларды сұрыптау</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="newest">Алдымен жаңалары</option>
            <option value="oldest">Алдымен ескілері</option>
          </select>
        </label>
      </div>

      <div
        className="mb-5 flex min-h-6 items-center justify-between gap-3"
        aria-live="polite"
      >
        <p className="text-sm text-slate-500">
          {filteredProjects.length} жоба көрсетілуде
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Тазарту <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Search size={22} aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">
            Сәйкес жоба табылмады
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Іздеу сөзін өзгертіңіз немесе басқа технологияны таңдаңыз.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Сүзгілерді тазарту
          </button>
        </div>
      )}
    </>
  );
}
