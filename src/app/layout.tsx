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
  title: "ИСАИ-25-1 | Біздің топ, жобалар және естеліктер",
  description:
    "ИСАИ-25-1 тобының өмірі, студенттердің портфолиосы және жылы тілектер тақтайшасы. Қорқыт Ата университеті.",
  openGraph: {
    title: "ИСАИ-25-1 | Біздің кішкентай әлем",
    description:
      "Біздің адамдар, бірге жасаған жобалар және жақсы естеліктер.",
    locale: "kk_KZ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ИСАИ-25-1 | Біздің кішкентай әлем",
    description:
      "Топ өмірі, студенттердің портфолиосы және жылы тілектер.",
  },
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
