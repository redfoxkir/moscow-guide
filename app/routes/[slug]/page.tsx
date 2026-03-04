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
  // Примерные координаты для шагов маршрутов
  const coordsByRoute: Record<string, Record<string, Coords>> = {
    "istoricheskiy-centr": {
      "start-metro": [55.7563, 37.6226], // Площадь Революции
      "krasnaya-ploshchad": [55.7539, 37.6208],
      zaryadye: [55.7523, 37.6286],
      "kitay-gorod": [55.7546, 37.6331]
    },
    "sovremennaya-moskva": {
      "start-metro": [55.7479, 37.5374], // Деловой центр
      naberezhnaya: [55.7489, 37.5465],
      "most-i-vidy": [55.7481, 37.554]
    },
    "parki-i-naberezhnye": {
      "start-metro": [55.7352, 37.6108], // Парк Культуры
      "park-gorkogo": [55.7309, 37.6011],
      "neskuchniy-sad": [55.7189, 37.593],
      most: [55.7166, 37.5817]
    }
  };

  const byRoute = coordsByRoute[slug];
  if (!byRoute) return [55.7558, 37.6176]; // центр Москвы по умолчанию

  return byRoute[stepId] ?? [55.7558, 37.6176];
}

function buildOsmEmbedUrl([lat, lng]: Coords) {
  const deltaLat = 0.02;
  const deltaLng = 0.03;
  const latMin = lat - deltaLat;
  const latMax = lat + deltaLat;
  const lngMin = lng - deltaLng;
  const lngMax = lng + deltaLng;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${lngMin},${latMin},${lngMax},${latMax}&layer=mapnik&marker=${lat},${lng}`;
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

  const goPrev = () => {
    if (!isFirst) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (!isLast) {
      setStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="container py-8 sm:py-10 lg:py-12 space-y-6 lg:space-y-8">
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
            <p className="text-xs sm:text-sm text-slate-400">
              {route.tagline}
            </p>
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
        <Card>
          <CardHeader>
            <CardTitle>Старт маршрута</CardTitle>
            <CardDescription>
              Все маршруты начинаются от понятной точки в городе — чаще всего от станции метро.
              Далее вы двигаетесь по шагам с фактами про каждое место.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm">
            <p>
              Для этого маршрута стартовая точка —{" "}
              <span className="font-medium text-slate-100">
                {route.startPoint}
              </span>
              . На карте это будет отдельный маркер, но сейчас маршрут проходит только через кнопки.
            </p>
            <p className="text-slate-400">
              На следующих шагах вы последовательно переходите от одной точки к другой:
              никакой геолокации, только понятные описания и факты. Это удобно, если вы в
              роуминге или просто не хотите включать GPS.
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
                <span>Навигация только через кнопки</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 text-slate-900 text-xs font-semibold">
                {stepIndex + 1}
              </span>
              <div className="space-y-0.5">
                <p className="text-slate-100 font-medium">
                  {currentStep.title}
                </p>
                {currentStep.subtitle && (
                  <p className="text-[11px] text-slate-400">
                    {currentStep.subtitle}
                  </p>
                )}
              </div>
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
                      <span className="mt-[5px] h-1 w-1 rounded-full bg-amber-400" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goPrev}
                disabled={isFirst}
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Предыдущая точка
              </Button>
              <Button
                size="sm"
                onClick={goNext}
                disabled={isLast}
              >
                {isLast ? "Маршрут завершён" : "Следующая точка"}
                {!isLast && (
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

