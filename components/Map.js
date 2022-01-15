import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { max as d3Max } from "d3-array";
import "mapbox-gl/dist/mapbox-gl.css";
import { CHART_STROKE_COLOR, CHART_MIN_HEIGHT } from "./settings.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

export const MAP_OPTIONS_DEFAULT = {
  center: [-97.74, 30.28],
  zoom: 10,
  style: "mapbox://styles/mapbox/light-v10",
  maxZoom: 18,
  // touchZoomRotate: false,
  touchPitch: false,
  dragRotate: false,
  // maxBounds: [
  //   [-98.27, 30.05],
  //   [-97.18318, 30.49],
  // ],
};

const addLayers = (map, zipPolys, zipCentroids) => {
  const findCentroid = (zipcode) => {
    return zipCentroids.features.find(
      (feature) => feature.properties.ZIPCODE == zipcode
    );
  };

  let hoveredStateId = null;

  const max = d3Max(
    zipCentroids.features,
    (feature) => feature.properties.count
  );

  map.addSource("zipPolys", {
    type: "geojson",
    data: zipPolys,
    generateId: true,
  });

  map.addSource("zipCentroids", {
    type: "geojson",
    data: zipCentroids,
  });

  map.addLayer({
    id: "zipsFill",
    type: "fill",
    source: "zipPolys",
    layout: {},
    paint: {
      "fill-color": CHART_STROKE_COLOR,
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.15,
        0,
      ],
    },
  });

  map.addLayer({
    id: "zipsOutline",
    type: "line",
    source: "zipPolys",
    layout: {},
    paint: {
      "line-color": "#fff",
      "line-width": 1,
    },
  });

  map.addLayer({
    id: "counts",
    type: "circle",
    source: "zipCentroids",
    paint: {
      "circle-radius": [
        "interpolate",
        ["exponential", 1],
        ["get", "count"],
        0,
        0,
        max,
        40,
      ],
      "circle-stroke-color": CHART_STROKE_COLOR,
      "circle-stroke-width": 1,
      "circle-color": CHART_STROKE_COLOR,
      "circle-opacity": 0.5,
    },
  });

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("click", "zipsFill", (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0];
      const zip = feature.properties.ZIPCODE;
      const centroid = findCentroid(zip);
      const count = centroid?.properties.count;
      const html = `<span><b>${zip}</b></span><br/><span>${count} filings</span>`;
      const coordinates = centroid.geometry.coordinates.slice();

      new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(map);

      if (hoveredStateId !== null) {
        // reset previous clicked feature
        map.setFeatureState(
          { source: "zipPolys", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = feature.id;
      map.setFeatureState(
        { source: "zipPolys", id: hoveredStateId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "state-fills", () => {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: "zipPolys", id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
};

export const useMap = (mapContainerRef, mapRef, zipPolys, zipCentroids) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!zipPolys || !zipCentroids) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      ...MAP_OPTIONS_DEFAULT,
    });
    mapRef.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
        showCompass: false,
      }),
      "bottom-right"
    );
    mapRef.current.once("load").then(() => {
      mapRef.current.addControl(new mapboxgl.FullscreenControl());
      setIsMapLoaded(true);
      addLayers(mapRef.current, zipPolys, zipCentroids);
    });
    return () => mapRef.current?.remove();
  }, [mapContainerRef, mapRef, zipPolys, zipCentroids]);

  return isMapLoaded;
};

const useGeoJSON = (url) => {
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setGeojson(data);
      });
  }, [url]);

  return geojson;
};

const useTotals = (data) => {
  const [totals, setTotals] = useState(null);
  useEffect(() => {
    if (!data) return;
    let newTotals = {};
    data.forEach((row) => {
      const zip = row.defendant_zip?.split("-")[0];
      if (!zip) {
        return;
      }
      const count = row.count;
      newTotals[zip] = zip in newTotals ? newTotals[zip] + count : count;
    });
    setTotals(newTotals);
  }, [data]);
  return totals;
};

const useMergedGeojson = (geojson, zipTotals) => {
  const [merged, setMerged] = useState(null);
  useEffect(() => {
    if (!geojson || !zipTotals) return;
    geojson.features.forEach((feature) => {
      const zip = feature.properties.ZIPCODE;
      const count = zipTotals[zip] || 0;
      feature.properties.count = count;
    });
    setMerged(geojson);
  }, [geojson, zipTotals]);
  return merged;
};

export default function Map({ data }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const zipTotals = useTotals(data);
  const zipPolys = useGeoJSON("/data/zips.polys.geojson");
  let zipCentroids = useGeoJSON("/data/zips.centroids.geojson");
  zipCentroids = useMergedGeojson(zipCentroids, zipTotals);
  const isMapLoaded = useMap(mapContainerRef, mapRef, zipPolys, zipCentroids);

  return (
    <div
      style={{ minHeight: 500, height: "100%", width: "100%" }}
      ref={mapContainerRef}
    ></div>
  );
}
