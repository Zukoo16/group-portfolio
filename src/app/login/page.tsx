"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, GraduationCap, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setError("Email немесе құпия сөз қате. Қайта тексеріп көріңіз.");
        return;
      }

      router.push(result.url ?? "/dashboard");
      router.refresh();
    } catch (submitError) {
      console.error("Login request failed:", submitError);
      setError("Жүйеге кіру мүмкін болмады. Біраздан соң қайталап көріңіз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="student-login student-workspace relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-slate-50 px-5 py-14">
      <div className="pointer-events-none absolute -left-36 top-8 size-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-indigo-100/70 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#f5eddb] p-10 text-stone-800 lg:flex">
          <div className="absolute -right-28 -top-20 size-80 rounded-full border border-blue-300/10" />
          <div className="absolute -right-10 top-4 size-44 rounded-full border border-blue-300/10" />
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold">
              <Image
                src="/korkyt-logo.jpg"
                alt="Қорқыт Ата университетінің логотипі"
                width={168}
                height={148}
                className="h-10 w-auto rounded-md bg-white px-2 sm:h-12"
                style={{ width: "auto" }}
              />
              <span>Ақпараттық жүйелер тобы</span>
            </Link>
            <div className="mt-24">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                Студент кабинеті
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                Сәлем, өз адамымыз!
                <br />
                Қош келдің :)
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-stone-600">
                Жобаңды көрсет, өзің туралы жаз, топқа бір жылы сөз қалдыр.
                Бәрі осы жерден басталады.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Қорқыт Ата атындағы Қызылорда университеті
          </p>
        </aside>

        <section className="p-6 sm:p-10 lg:p-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={16} /> Басты бетке қайту
          </Link>

          <div className="mt-10 lg:mt-12">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 lg:hidden">
              <GraduationCap size={24} />
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              Қош келдіңіз!
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Кабинетке кіру үшін университет берген деректерді енгізіңіз.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Электрондық пошта
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@university.kz"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Құпия сөз
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Құпия сөзіңізді енгізіңіз"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Кіру орындалуда..." : "Жүйеге кіру"}
              {!busy && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Кіру деректерін алу үшін практика жетекшісіне хабарласыңыз.
          </p>
        </section>
      </div>
    </main>
  );
}
