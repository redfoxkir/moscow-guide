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

      map.on("load", async () => {
        // Markers
        const addMarker = (coords: [number, number], color: string, size: number, label: string, popupOffset: number) => {
          const el = document.createElement("div");
          el.style.cssText = `
            width:${size}px;height:${size}px;
            background:${color};
            border:2px solid #fff;
            border-radius:50%;
            box-shadow:0 0 0 3px rgba(251,191,36,0.3),0 2px 6px rgba(0,0,0,0.4);
            cursor:pointer;
          `;
          new maplibregl.Marker({ element: el })
            .setLngLat(coords)
            .setPopup(new maplibregl.Popup({ offset: popupOffset, closeButton: false }).setText(label))
            .addTo(map);
        };

        addMarker([lng, lat], "linear-gradient(135deg,#f97316,#fbbf24)", 14, currentLabel, 16);

        if (nextCoords) {
          const [nLat, nLng] = nextCoords;
          addMarker([nLng, nLat], "rgba(251,191,36,0.5)", 11, nextLabel ?? "", 14);

          // Decode Valhalla's encoded polyline (precision 6)
          const decodePolyline = (str: string): [number, number][] => {
            let i = 0, lat = 0, lon = 0;
            const coords: [number, number][] = [];
            while (i < str.length) {
              let shift = 0, result = 0, b;
              do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
              lat += result & 1 ? ~(result >> 1) : result >> 1;
              shift = 0; result = 0;
              do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
              lon += result & 1 ? ~(result >> 1) : result >> 1;
              coords.push([lon / 1e6, lat / 1e6]);
            }
            return coords;
          };

          // Fetch pedestrian route from Valhalla (free, no API key, real walking paths)
          let routeCoords: [number, number][] | null = null;
          try {
            const res = await fetch("https://valhalla1.openstreetmap.de/route", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                locations: [
                  { lon: lng, lat: lat },
                  { lon: nLng, lat: nLat },
                ],
                costing: "pedestrian",
                directions_options: { units: "km" },
              }),
            });
            const data = await res.json();
            const shape = data?.trip?.legs?.[0]?.shape;
            if (shape) {
              routeCoords = decodePolyline(shape);
            }
          } catch (e) {
            console.error("Valhalla routing failed:", e);
          }

          // Fallback: straight line
          const lineCoords: [number, number][] = routeCoords ?? [[lng, lat], [nLng, nLat]];

          map.addSource("route-line", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "LineString", coordinates: lineCoords },
              properties: {},
            },
          });

          // Outer glow layer
          map.addLayer({
            id: "route-line-glow",
            type: "line",
            source: "route-line",
            paint: {
              "line-color": "#f59e0b",
              "line-width": 8,
              "line-opacity": 0.15,
              "line-blur": 4,
            },
          });

          // Main route line
          map.addLayer({
            id: "route-line-layer",
            type: "line",
            source: "route-line",
            paint: {
              "line-color": "#f59e0b",
              "line-width": 3,
              "line-opacity": 0.75,
              "line-dasharray": [1.5, 2],
            },
          });

          // Fit bounds
          const allCoords = lineCoords;
          const lngs = allCoords.map(c => c[0]);
          const lats = allCoords.map(c => c[1]);
          const bounds = new maplibregl.LngLatBounds(
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)]
          );
          map.fitBounds(bounds, { padding: 52, maxZoom: 16 });
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
