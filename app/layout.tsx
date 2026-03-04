import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "МосГид — путеводитель по Москве",
  description: "Современный путеводитель по Москве с интерактивной картой и подборками мест."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="page-shell">
        <header className="border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
          <div className="container flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-300 shadow-soft" />
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-400">
                  Moscow
                </p>
                <p className="text-lg font-semibold">МосГид</p>
              </div>
            </div>
            <nav className="flex items-center gap-3 text-sm text-slate-300">
              <a href="/" className="hover:text-white transition-colors">
                Главная
              </a>
              <a href="/map" className="hover:text-white transition-colors">
                Карта
              </a>
            </nav>
          </div>
        </header>
        <main className="page-shell-main">
          {children}
        </main>
        <footer className="border-t border-slate-800/70 bg-slate-950/80 backdrop-blur-lg">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 py-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} МосГид. Неформальный путеводитель по Москве.</span>
            <span>Проект для демонстрации Next.js + Tailwind + shadcn UI.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

