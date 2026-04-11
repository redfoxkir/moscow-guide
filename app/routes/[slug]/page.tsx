'use client';

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cityRoutes, getRouteBySlug } from "@/data/routes";

type RoutePageProps = {
  params: {
    slug: string;
  };
};

type Coords = [number, number];

function getStepCoords(slug: string, stepId: string): Coords {
  const coordsByRoute: Record<string, Record<string, Coords>> = {
    "istoricheskiy-centr": {
      "start-metro":        [55.7563, 37.6226],
      "krasnaya-ploshchad": [55.7539, 37.6208],
      zaryadye:             [55.7523, 37.6286],
      "kitay-gorod":        [55.7546, 37.6331],
      "alexandrovskiy-sad": [55.7516, 37.6127],
      teatralnaya:          [55.7601, 37.6186]
    },
    "parki-i-naberezhnye": {
      "start-metro":    [55.7352, 37.6108],
      "park-gorkogo":   [55.7309, 37.6011],
      "neskuchniy-sad": [55.7189, 37.5930],
      most:             [55.7166, 37.5817],
      "vorobyovy-gory": [55.7094, 37.5441],
      luzhniki:         [55.7156, 37.5543]
    }
  };

  const byRoute = coordsByRoute[slug];
  if (!byRoute) return [55.7558, 37.6176];
  return byRoute[stepId] ?? [55.7558, 37.6176];
}

function buildOsmEmbedUrl([lat, lng]: Coords) {
  const deltaLat = 0.02;
  const deltaLng = 0.03;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - deltaLng},${lat - deltaLat},${lng + deltaLng},${lat + deltaLat}&layer=mapnik&marker=${lat},${lng}`;
}

export default function RoutePage({ params }: RoutePageProps) {
  const route = useMemo(() => getRouteBySlug(params.slug), [params.slug]);

  if (!route) {
    notFound();
  }

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = route.steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === route.steps.length - 1;
  const currentCoords = getStepCoords(route.slug, currentStep.id);
  const mapUrl = buildOsmEmbedUrl(currentCoords);

  const goPrev = () => { if (!isFirst) setStepIndex((i) => i - 1); };
  const goNext = () => { if (!isLast) setStepIndex((i) => i + 1); };

  return (
    <div className="container py-8 sm:py-10 lg:py-12 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="/">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Все маршруты
            </a>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {route.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">{route.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-slate-800/80 px-3 py-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{route.startMetro}</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-slate-800/80 px-3 py-1 text-slate-400">
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            <span>{route.duration}</span>
          </span>
        </div>
      </div>

      {/* Step progress timeline */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-max px-1">
          {route.steps.map((step, index) => {
            const isPast    = index < stepIndex;
            const isCurrent = index === stepIndex;
            const isNext    = index === stepIndex + 1;

            return (
              <div key={step.id} className="flex items-center">
                {/* Dot */}
                <button
                  onClick={() => setStepIndex(index)}
                  className={[
                    "flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none",
                    isCurrent
                      ? "h-9 w-9 bg-gradient-to-tr from-orange-500 to-amber-300 text-slate-900 ring-2 ring-amber-300/40 shadow-lg shadow-orange-500/30 scale-110"
                      : isPast
                      ? "h-7 w-7 bg-gradient-to-tr from-orange-600/80 to-amber-400/80 text-slate-900"
                      : isNext
                      ? "h-7 w-7 bg-slate-800 text-amber-400/60 ring-1 ring-amber-400/30 hover:bg-slate-700"
                      : "h-7 w-7 bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
                  ].join(" ")}
                  title={step.title}
                >
                  {index + 1}
                </button>

                {/* Connecting line */}
                {index < route.steps.length - 1 && (
                  <div
                    className={[
                      "relative mx-1 overflow-hidden rounded-full",
                      isCurrent ? "h-1.5 w-12 sm:w-16" : "h-0.5 w-10 sm:w-14"
                    ].join(" ")}
                  >
                    {/* base track */}
                    <div className="absolute inset-0 bg-slate-800 rounded-full" />

                    {/* past: solid filled */}
                    {isPast && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400" />
                    )}

                    {/* current → next: pulsing dashed amber line */}
                    {isCurrent && (
                      <div
                        className="absolute inset-0 animate-pulse"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 7px, transparent 7px, transparent 14px)",
                          opacity: 0.75
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <span className="ml-3 text-xs text-slate-400 whitespace-nowrap">
            {stepIndex + 1} / {route.steps.length}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
        <Card>
          <CardHeader>
            <CardTitle>Старт маршрута</CardTitle>
            <CardDescription>
              Все маршруты начинаются от понятной точки в городе — чаще всего от
              станции метро. Далее вы двигаетесь по шагам с фактами про каждое место.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm">
            <p>
              Для этого маршрута стартовая точка —{" "}
              <span className="font-medium text-slate-100">{route.startPoint}</span>.
              На карте это будет отдельный маркер, но сейчас маршрут проходит только
              через кнопки.
            </p>
            <p className="text-slate-400">
              На следующих шагах вы последовательно переходите от одной точки к другой:
              никакой геолокации, только понятные описания и факты. Это удобно, если вы
              в роуминге или просто не хотите включать GPS.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>
                  Шаг {stepIndex + 1} из {route.steps.length}
                </CardTitle>
                <CardDescription>
                  {isFirst
                    ? "Стартовая точка маршрута."
                    : isLast
                    ? "Финальная точка маршрута."
                    : "Промежуточная точка пути."}
                </CardDescription>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Навигация через кнопки</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 text-slate-900 text-xs font-semibold">
                {stepIndex + 1}
              </span>
              <div className="space-y-0.5">
                <p className="text-slate-100 font-medium">{currentStep.title}</p>
                {currentStep.subtitle && (
                  <p className="text-[11px] text-slate-400">{currentStep.subtitle}</p>
                )}
              </div>
              {!isLast && (
                <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ArrowRight className="h-3 w-3" />
                  <span>{route.steps[stepIndex + 1].title}</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200">
              {currentStep.description}
            </p>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Карта текущей точки
              </p>
              <div className="h-44 sm:h-56 rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
                <iframe
                  key={`${route.slug}-${currentStep.id}`}
                  title={`Карта шага ${currentStep.title}`}
                  src={mapUrl}
                  className="h-full w-full"
                />
              </div>
            </div>

            {currentStep.facts && currentStep.facts.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Короткие факты о точке
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentStep.facts.map((fact) => (
                    <li key={fact} className="flex gap-2">
                      <span className="mt-[5px] h-1 w-1 rounded-full bg-amber-400 flex-shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={goPrev} disabled={isFirst}>
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Назад
              </Button>
              <Button size="sm" onClick={goNext} disabled={isLast}>
                {isLast ? "Маршрут завершён" : "Следующая точка"}
                {!isLast && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
