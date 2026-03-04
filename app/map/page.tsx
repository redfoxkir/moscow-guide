import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="container py-6 sm:py-8 lg:py-10 space-y-5 lg:space-y-8">
      <div className="space-y-2 max-w-2xl">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          Карта Москвы
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          На этой карте вы можете ориентироваться по городу: находить центр, набережные,
          крупные магистрали и примерные районы прогулок. Основная логика маршрутов остаётся
          на отдельных экранах, где шаги переключаются кнопками.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Интерактивная карта OpenStreetMap</CardTitle>
          <CardDescription>
            Встроенная карта из OpenStreetMap без сторонних библиотек. Позже можно будет
            заменить ссылку в iframe на заранее настроенный вид или собственный слой.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950">
            <iframe
              title="Карта Москвы — OpenStreetMap"
              src="https://www.openstreetmap.org/export/embed.html?bbox=37.52,55.70,37.72,55.80&layer=mapnik&marker=55.7558,37.6176"
              className="h-full w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

