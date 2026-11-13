import { ArrowUpRight, CodeXml, Layers3 } from "lucide-react";

export type PublicProject = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
  user: { name: string; githubUrl: string | null };
  isDemoPreview?: boolean;
};

const tagStyles = [
  "bg-blue-50 text-blue-700 ring-blue-100",
  "bg-indigo-50 text-indigo-700 ring-indigo-100",
  "bg-slate-100 text-slate-700 ring-slate-200",
  "bg-sky-50 text-sky-700 ring-sky-100",
];

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
          <Layers3 size={21} />
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            project.isDemoPreview
              ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
              : "bg-slate-50 text-slate-500"
          }`}
        >
          {project.isDemoPreview
            ? "Үлгі жоба"
            : new Intl.DateTimeFormat("kk-KZ", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(project.createdAt))}
        </span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-slate-950">
        {project.title}
      </h3>
      <p className="mt-3 line-clamp-4 min-h-24 whitespace-pre-line text-sm leading-6 text-slate-600">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((technology, index) => (
          <span
            key={`${technology}-${index}`}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tagStyles[index % tagStyles.length]}`}
          >
            {technology}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Автор
          </p>
          {project.user.githubUrl ? (
            <a
              href={project.user.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              {project.user.name}
            </a>
          ) : (
            <p className="mt-1 truncate text-sm font-semibold text-slate-700">
              {project.user.name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} GitHub репозиторий`}
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              <CodeXml size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
            >
              Демо <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
