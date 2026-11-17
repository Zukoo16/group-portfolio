"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { ArrowUpRight, Send, Trash2 } from "lucide-react";

type Wish = { id: string; message: string; userId: string; createdAt: string; user: { name: string } };
const noteColors = ["note-yellow", "note-pink", "note-green", "note-lilac"];

export function WishBoard({ initialWishes }: { initialWishes: Wish[] | null }) {
  const { data: session, status } = useSession();
  const [wishes, setWishes] = useState(initialWishes ?? []);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    try {
      const response = await fetch("/api/wishes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setWishes((current) => [result, ...current].slice(0, 60));
      setMessage("");
      setFeedback("Жылы сөзің тақтайшаға қосылды 💛");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Тілек сақталмады.");
    } finally { setBusy(false); }
  }

  async function remove(id: string) {
    setDeleting(id);
    setFeedback("");
    try {
      const response = await fetch(`/api/wishes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Тілекті өшіру мүмкін болмады.");
      setWishes((current) => current.filter((wish) => wish.id !== id));
      setFeedback("Тілегің өшірілді.");
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Қате пайда болды."); }
    finally { setDeleting(null); }
  }

  return (
    <section id="wishes" className="community-section wish-section scroll-mt-24">
      <div className="section-topline"><span className="eyebrow">04 / Жылы сөз қалдыр</span><span aria-hidden="true">✳</span></div>
      <div className="section-intro"><div><h2>Тілек тақтайшасы<span className="text-orange-500">.</span></h2><p>Бір ауыз жақсы сөз біреудің күнін әдемі етеді.</p></div><span className="little-sticker">Тек жақсы vibes ✌️</span></div>
      {initialWishes === null && <p className="mb-6 text-sm text-amber-800">Тақтайша қазір жүктелмеді. Кейінірек қайта кіріп көр.</p>}
      <div className="grid items-start gap-7 lg:grid-cols-[1fr_2fr]">
        <div className="wish-compose">
          <h3 className="text-xl font-bold">Кімге не тілейсің? 💌</h3>
          {status === "authenticated" ? <form onSubmit={submit} className="mt-4 space-y-3">
            <label htmlFor="wish-message" className="text-sm text-stone-600">Топқа немесе досыңа жылы сөз жаз.</label>
            <textarea id="wish-message" required maxLength={500} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Бәрімізге сәттілік! Келесі жобамыз бұдан да күшті болсын :)" className="w-full resize-y rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6" />
            <div className="flex items-center justify-between gap-3"><span className="text-xs text-stone-500">{message.length}/500</span><button disabled={busy || !message.trim()} className="warm-button disabled:opacity-50" type="submit">{busy ? "Қосылуда…" : "Тілек қалдыру"}<Send size={15} /></button></div>
          </form> : <div className="mt-4"><p className="mb-5 text-sm leading-6 text-stone-600">Тілектер бәріне көрінеді. Өз атыңнан жазу үшін аккаунтыңа кір.</p><Link href="/login" className="warm-button">{status === "loading" ? "Күте тұр…" : "Кіріп, тілек жазу"}<ArrowUpRight size={16} /></Link></div>}
          <p role="status" className="mt-4 text-sm leading-6 text-stone-700">{feedback}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {wishes.map((wish, index) => <article key={wish.id} className={`wish-note ${noteColors[index % noteColors.length]}`}>
            <span aria-hidden="true" className="note-pin" />
            <p className="min-h-20 whitespace-pre-wrap break-words text-base leading-7">{wish.message}</p>
            <div className="mt-6 flex items-end justify-between gap-3"><div><Link href={`/students/${wish.userId}`} className="text-sm font-bold hover:underline">{wish.user.name}</Link><p className="mt-1 text-xs opacity-60">{new Intl.DateTimeFormat("kk-KZ", { day: "numeric", month: "short", timeZone: "Asia/Bishkek" }).format(new Date(wish.createdAt))}</p></div>
              {session?.user.id === wish.userId && <button type="button" disabled={deleting === wish.id} onClick={() => remove(wish.id)} aria-label="Өз тілегімді өшіру" className="rounded-full p-2 hover:bg-black/5 disabled:opacity-40"><Trash2 size={16} /></button>}</div>
          </article>)}
          {wishes.length === 0 && <div className="wish-note note-yellow sm:col-span-2"><p className="text-3xl" aria-hidden="true">💛</p><h3 className="mt-4 text-xl font-bold">Алғашқы жылы сөз сенікі болсын!</h3><p className="mt-3 text-sm leading-6">Топқа сәттілік тіле, досыңа рақмет айт немесе жай ғана сәлем қалдыр.</p></div>}
        </div>
      </div>
      <p className="mt-6 text-xs text-stone-500">Соңғы 60 тілек көрсетіледі.</p>
    </section>
  );
}
