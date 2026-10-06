import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSetting.findMany({
    where: { group: 'GLOBAL' }
  });

  const getSetting = (key: string, defaultValue: string) => {
    return settings.find(s => s.key === key)?.value || defaultValue;
  };

  const title = getSetting('GLOBAL_HERO_TITLE', "Yayasan Ahmad Surur Cendekia (ASCA)");
  const description = getSetting('GLOBAL_HERO_DESC', "Mendidik generasi Qur'ani yang berakhlak mulia, cerdas, dan mandiri melalui Rumah Qur'an Assurur dan SD Qur'an Assurur.");
  const favicon = getSetting('GLOBAL_FAVICON', "/favicon.ico");

  return {
    title: `ASCA | ${title}`,
    description,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0a0f1c] dark:text-slate-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
