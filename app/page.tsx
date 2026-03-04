import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cityRoutes } from "@/data/routes";

export default function HomePage() {
  return (
    <div className="container py-8 sm:py-10 lg:py-12 space-y-8 lg:space-y-10">
      <section className="space-y-6 max-w-3xl">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Пошаговые прогулки по Москве</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Выберите маршрут{" "}
            <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-300 bg-clip-text text-transparent">
              по Москве
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl">
            Здесь нет GPS и сложных карт: каждый маршрут — это понятная цепочка точек
            от станции метро до финальной точки с короткими фактами на каждом шаге.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Старт всегда от метро
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Шаг за шагом по городу
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Только текст и кнопки, без геолокации
          </span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch">
        <Card>
          <CardHeader>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-amber-300/80">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Философия проекта
            </div>
            <CardTitle>Город — это история, а не координаты</CardTitle>
            <CardDescription>
              Мы делаем путеводитель, который работает даже без точной геолокации: вы не «ловите точку»,
              а спокойно идёте по понятным шагам от метро к месту, читая короткие факты по пути.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="grid gap-2">
              <div className="flex gap-2">
                <span className="mt-[6px] h-1 w-1 rounded-full bg-emerald-400" />
                <p>
                  <span className="font-medium text-slate-100">Никакой зависимости от GPS.</span>{" "}
                  В Москве геолокация может прыгать — значит, навигация должна быть устойчивой.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="mt-[6px] h-1 w-1 rounded-full bg-sky-400" />
                <p>
                  <span className="font-medium text-slate-100">Один шаг — одна точка.</span>{" "}
                  Не перегружаем: показываем ровно то, что нужно сейчас.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="mt-[6px] h-1 w-1 rounded-full bg-rose-400" />
                <p>
                  <span className="font-medium text-slate-100">Старт от метро.</span>{" "}
                  Это самый понятный якорь, чтобы начать прогулку без лишних инструкций.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="mt-[6px] h-1 w-1 rounded-full bg-amber-300" />
                <p>
                  <span className="font-medium text-slate-100">Факты вместо шума.</span>{" "}
                  Короткие заметки помогают увидеть город внимательнее.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Как пользоваться</CardTitle>
            <CardDescription>
              Мини‑инструкция: выбрать маршрут → дойти до старта → нажимать «Следующая точка».
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
              <p className="text-slate-100 font-medium">3 простых правила</p>
              <ol className="space-y-1.5 text-slate-300">
                <li className="flex gap-2">
                  <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                    1
                  </span>
                  <span>Выбирайте маршрут по настроению и времени.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                    2
                  </span>
                  <span>Начинайте от указанного метро (стартовая точка всегда понятная).</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                    3
                  </span>
                  <span>Двигайтесь по шагам: читайте факты и жмите «Следующая точка».</span>
                </li>
              </ol>
            </div>
            <p className="text-slate-400">
              Карта — это подсказка, а не обязательное условие: маршрут можно пройти, даже если интернет слабый.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="routes" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
              Маршруты для стартa
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Выберите один из маршрутов: сначала вы увидите стартовую точку у метро,
              затем сможете переходить к следующим точкам с помощью кнопки внизу экрана.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/map">
              Страница с картой
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cityRoutes.map((route) => (
            <Card key={route.slug}>
              <CardHeader>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-amber-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Маршрут
                </div>
                <CardTitle>{route.name}</CardTitle>
                <CardDescription>{route.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs text-slate-400 mb-3">
                  <p className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      Старт: {route.startMetro}
                    </span>
                  </p>
                  <p>{route.mood}</p>
                  <p className="flex items-center justify-between gap-2 text-slate-500">
                    <span>Длительность: {route.duration}</span>
                    <span>{route.stepsCount} точек</span>
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/routes/${route.slug}`}>
                    Начать маршрут
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

