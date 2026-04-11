'use client';

import { useEffect, useRef } from "react";

type Coords = [number, number]; // [lat, lng]

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

    const init = async () => {
      const maplibregl = (await import("maplibre-gl")).default;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const [lat, lng] = currentCoords;

      const map = new maplibregl.Map({
        container: containerRef.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: [lng, lat],
        zoom: 14,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        // Draw dashed line to next point
        if (nextCoords) {
          const [nLat, nLng] = nextCoords;

          map.addSource("route-line", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [lng, lat],
                  [nLng, nLat],
                ],
              },
              properties: {},
            },
          });

          map.addLayer({
            id: "route-line-layer",
            type: "line",
            source: "route-line",
            paint: {
              "line-color": "#f59e0b",
              "line-width": 3,
              "line-opacity": 0.6,
              "line-dasharray": [2, 3],
            },
          });

          // Fit bounds to show both points
          const bounds = new maplibregl.LngLatBounds(
            [Math.min(lng, nLng), Math.min(lat, nLat)],
            [Math.max(lng, nLng), Math.max(lat, nLat)]
          );
          map.fitBounds(bounds, { padding: 52, maxZoom: 16 });
        }

        // Current point marker
        const currentEl = document.createElement("div");
        currentEl.style.cssText = `
          width:14px;height:14px;
          background:linear-gradient(135deg,#f97316,#fbbf24);
          border:2px solid #fff;
          border-radius:50%;
          box-shadow:0 0 0 3px rgba(251,191,36,0.35),0 2px 6px rgba(0,0,0,0.4);
        `;
        new maplibregl.Marker({ element: currentEl })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 16, closeButton: false })
            .setText(currentLabel))
          .addTo(map);

        // Next point marker (semi-transparent)
        if (nextCoords) {
          const [nLat, nLng] = nextCoords;
          const nextEl = document.createElement("div");
          nextEl.style.cssText = `
            width:11px;height:11px;
            background:rgba(251,191,36,0.4);
            border:2px solid rgba(251,191,36,0.7);
            border-radius:50%;
            box-shadow:0 0 0 2px rgba(251,191,36,0.15);
          `;
          new maplibregl.Marker({ element: nextEl })
            .setLngLat([nLng, nLat])
            .setPopup(new maplibregl.Popup({ offset: 14, closeButton: false })
              .setText(nextLabel ?? ""))
            .addTo(map);
        }
      });
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
        .maplibregl-canvas { border-radius: 0.75rem; }
        .maplibregl-popup-content {
          background: rgba(15,23,42,0.92) !important;
          border: 1px solid rgba(100,116,139,0.4) !important;
          border-radius: 6px !important;
          color: #f1f5f9 !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          padding: 4px 10px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
        }
        .maplibregl-popup-tip { display: none !important; }
      `}</style>
      <div ref={containerRef} className="h-full w-full rounded-xl" />
    </>
  );
}
