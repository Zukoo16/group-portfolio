import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ақпараттық жүйелер тобы | Студенттер портфолиосы",
  description:
    "Қорқыт Ата атындағы Қызылорда университеті студенттерінің жобалары мен практика портфолиосы.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="kk" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-slate-900">
        <Providers session={null}>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
