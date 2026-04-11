'use client';

import { useEffect, useRef } from "react";

type Coords = [number, number];

type Props = {
  currentCoords: Coords;
  nextCoords: Coords | null;
  currentLabel: string;
  nextLabel: string | null;
};

export default function RouteMap({ currentCoords, nextCoords, currentLabel, nextLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let L: any;

    const init = async () => {
      L = (await import("leaflet")).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      // Current point marker (orange)
      const orangeIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:14px;height:14px;
          background:linear-gradient(135deg,#f97316,#fbbf24);
          border:2px solid #fff;
          border-radius:50%;
          box-shadow:0 0 0 3px rgba(251,191,36,0.35),0 2px 6px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker(currentCoords, { icon: orangeIcon })
        .addTo(map)
        .bindTooltip(currentLabel, { permanent: true, direction: "top", offset: [0, -10], className: "route-tooltip" });

      if (nextCoords) {
        // Next point marker (semi-transparent)
        const nextIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:11px;height:11px;
            background:rgba(251,191,36,0.45);
            border:2px solid rgba(251,191,36,0.7);
            border-radius:50%;
            box-shadow:0 0 0 2px rgba(251,191,36,0.15);
          "></div>`,
          iconSize: [11, 11],
          iconAnchor: [5, 5],
        });

        L.marker(nextCoords, { icon: nextIcon })
          .addTo(map)
          .bindTooltip(nextLabel ?? "", { permanent: true, direction: "top", offset: [0, -10], className: "route-tooltip route-tooltip--next" });

        // Dashed semi-transparent line between current and next
        L.polyline([currentCoords, nextCoords], {
          color: "#f59e0b",
          weight: 3,
          opacity: 0.55,
          dashArray: "8, 10",
          lineCap: "round",
        }).addTo(map);

        // Fit bounds to show both points with padding
        const bounds = L.latLngBounds([currentCoords, nextCoords]);
        map.fitBounds(bounds, { padding: [48, 48] });
      } else {
        map.setView(currentCoords, 15);
      }
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentCoords, nextCoords, currentLabel, nextLabel]);

  return (
    <>
      <style>{`
        .route-tooltip {
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(100,116,139,0.4);
          border-radius: 6px;
          color: #f1f5f9;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .route-tooltip::before { display: none; }
        .route-tooltip--next { color: #fbbf24; opacity: 0.8; }
        .leaflet-container { background: #0f172a; }
      `}</style>
      <div ref={containerRef} className="h-full w-full rounded-xl" />
    </>
  );
}
