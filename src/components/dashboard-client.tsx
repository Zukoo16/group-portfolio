"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  CodeXml,
  Link2,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

export type DashboardProject = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
};

type Profile = {
  name: string;
  email: string;
  bio: string;
  githubUrl: string;
};

type ProjectForm = {
  title: string;
  description: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
};

const emptyProject: ProjectForm = {
  title: "",
  description: "",
  techStack: "",
  liveUrl: "",
  githubUrl: "",
};

export function DashboardClient({
  initialProjects,
  initialProfile,
  databaseError,
}: {
  initialProjects: DashboardProject[];
  initialProfile: Profile;
  databaseError: boolean;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);
  const [projectBusy, setProjectBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(
    databaseError
      ? "Демо режимі: MySQL қосылмағандықтан, өзгерістер сақталмайды."
      : "",
  );

  function resetProjectForm() {
    setForm(emptyProject);
    setEditingId(null);
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setProjectBusy(true);

    try {
      const response = await fetch(
        editingId ? `/api/projects/${editingId}` : "/api/projects",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            techStack: form.techStack.split(",").map((item) => item.trim()).filter(Boolean),
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Жобаны сақтау мүмкін болмады.");

      const savedProject: DashboardProject = {
        ...result,
        techStack: Array.isArray(result.techStack) ? result.techStack : [],
        createdAt:
          typeof result.createdAt === "string"
            ? result.createdAt
            : new Date(result.createdAt).toISOString(),
      };
      setProjects((current) =>
        editingId
          ? current.map((project) => (project.id === editingId ? savedProject : project))
          : [savedProject, ...current],
      );
      setNotice(editingId ? "Жоба жаңартылды." : "Жоба портфолиоға қосылды.");
      resetProjectForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Сұрауды орындау кезінде қате пайда болды.",
      );
    } finally {
      setProjectBusy(false);
    }
  }

  function beginEdit(project: DashboardProject) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      liveUrl: project.liveUrl ?? "",
      githubUrl: project.githubUrl ?? "",
    });
    setNotice("");
    setError("");
    document.getElementById("project-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function deleteProject(project: DashboardProject) {
    if (!window.confirm(`«${project.title}» жобасын өшіргіңіз келе ме?`)) return;
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? "Жобаны өшіру мүмкін болмады.");
      }
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (editingId === project.id) resetProjectForm();
      setNotice("Жоба өшірілді.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Жобаны өшіру кезінде қате пайда болды.",
      );
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setProfileBusy(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Профильді сақтау мүмкін болмады.");

      setProfile({
        name: result.name,
        email: result.email,
        bio: result.bio ?? "",
        githubUrl: result.githubUrl ?? "",
      });
      setNotice("Профиль жаңартылды.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Профильді сақтау кезінде қате пайда болды.",
      );
    } finally {
      setProfileBusy(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Студент кабинеті
          </p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Сәлем, {profile.name || "студент"}!
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Жобаларыңызды басқарып, портфолиоңызды толықтырыңыз.
              </p>
            </div>
            <a
              href="#project-form"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <Plus size={17} /> Жоба қосу
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xl font-bold text-slate-950">{projects.length}</span>
              <span className="ml-2 text-sm text-slate-500">жобаңыз</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">{profile.email}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <section className="space-y-6">
          <div id="project-form" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
                  Жобаңызды жариялаңыз
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  {editingId ? "Жобаны өңдеу" : "Жаңа жоба қосу"}
                </h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Өңдеуді тоқтату"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Жоба атауы *
                </label>
                <input
                  id="title"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Мысалы: Студенттік платформа"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Сипаттама *
                </label>
                <textarea
                  id="description"
                  required
                  maxLength={10000}
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Жобаның мақсаты мен негізгі мүмкіндіктерін сипаттаңыз..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label htmlFor="techStack" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Технологиялар *
                </label>
                <input
                  id="techStack"
                  required
                  value={form.techStack}
                  onChange={(event) => setForm({ ...form, techStack: event.target.value })}
                  placeholder="Next.js, TypeScript, MySQL"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <p className="mt-1.5 text-xs text-slate-400">Технологияларды үтірмен бөліңіз.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="liveUrl" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Демо сілтемесі
                  </label>
                  <input
                    id="liveUrl"
                    type="url"
                    value={form.liveUrl}
                    onChange={(event) => setForm({ ...form, liveUrl: event.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="githubUrl" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    GitHub репозиторий
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={(event) => setForm({ ...form, githubUrl: event.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={projectBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {projectBusy ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : editingId ? (
                  <Save size={16} />
                ) : (
                  <Plus size={17} />
                )}
                {projectBusy ? "Сақталуда..." : editingId ? "Өзгерісті сақтау" : "Жобаны жариялау"}
              </button>
            </form>
          </div>

          <section aria-labelledby="my-projects-heading">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Портфолио
                </p>
                <h2 id="my-projects-heading" className="mt-1 text-xl font-bold text-slate-950">
                  Менің жобаларым
                </h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {projects.length}
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Link2 size={20} />
                </span>
                <p className="mt-3 font-semibold text-slate-800">Жоба әлі қосылмады</p>
                <p className="mt-1 text-sm text-slate-500">
                  Алғашқы жобаңызды жоғарыдағы форма арқылы жариялаңыз.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-950">{project.title}</h3>
                        <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {project.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.techStack.map((technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700"
                            >
                              <CodeXml size={14} /> GitHub <ArrowUpRight size={12} />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700"
                            >
                              <ExternalLink size={14} /> Демо <ArrowUpRight size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(project)}
                          className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          aria-label={`${project.title} жобасын өңдеу`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(project)}
                          className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          aria-label={`${project.title} жобасын өшіру`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <UserRound size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-700">
                  Жеке деректер
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-slate-950">Профиль</h2>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="profile-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Аты-жөні *
                </label>
                <input
                  id="profile-name"
                  required
                  maxLength={100}
                  value={profile.name}
                  onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Мамандығыңыз / bio
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  maxLength={500}
                  value={profile.bio}
                  onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                  placeholder="Мысалы: Full-stack әзірлеуші"
                  className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm leading-5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label htmlFor="profile-github" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  GitHub профилі
                </label>
                <input
                  id="profile-github"
                  type="url"
                  value={profile.githubUrl}
                  onChange={(event) => setProfile({ ...profile, githubUrl: event.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <button
                type="submit"
                disabled={profileBusy}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                {profileBusy ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Өзгерістерді сақтау
              </button>
            </form>
          </section>

          {(error || notice) && (
            <div
              role={error ? "alert" : "status"}
              className={`rounded-xl border px-4 py-3 text-sm leading-5 ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {error || notice}
            </div>
          )}

          <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 p-5 text-white shadow-lg shadow-blue-900/10">
            <p className="text-sm font-semibold">Пайдалы кеңес</p>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Жобаңызды түсінікті сипаттап, демо мен GitHub сілтемесін қосуды
              ұмытпаңыз — бұл жұмысыңызды таныстыруға көмектеседі.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
