"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { ArrowUpRight, LogOut } from "lucide-react";

export function SiteHeader() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Негізгі навигация"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/korkyt-logo.jpg"
            alt="Қорқыт Ата атындағы Қызылорда университеті"
            width={168}
            height={148}
            priority
            className="h-8 w-auto sm:h-12"
            style={{ width: "auto" }}
          />
          <span className="hidden h-9 border-l border-slate-200 sm:block" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold tracking-tight text-slate-950">
              Қорқыт Ата университеті
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Ақпараттық жүйелер тобы · Студенттер портфолиосы
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/#projects"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-700 sm:block"
          >
            Жобалар
          </Link>
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 sm:px-4"
              >
                Кабинет
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                aria-label="Жүйеден шығу"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Шығу</span>
              </button>
            </>
          ) : status === "loading" ? (
            <span className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Студентке кіру <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
