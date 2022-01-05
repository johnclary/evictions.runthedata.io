import { useRef, useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import mapboxgl from "mapbox-gl";
import { min as d3min, max as d3max } from "d3-array";
import "mapbox-gl/dist/mapbox-gl.css";
import { CHART_STROKE_COLOR } from "./settings.js";

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
  let hoveredStateId = null;

  // const min = d3min(
  //   zipCentroids.features,
  //   (feature) => feature.properties.count
  // );

  const max = d3max(
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

  map.addLayer({
    id: "labels",
    type: "symbol",
    source: "zipPolys",
    layout: {
      "text-field": ["get", "ZIPCODE"],
      "text-anchor": "center",
      "text-radial-offset": 0.5,
      "text-justify": "auto",
    },
    paint: {
      "text-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0,
      ],
    },
  });

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("mousemove", "zipsFill", (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: "zipPolys", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
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
  }, []);

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

const usedMergedGeojson = (geojson, zipTotals) => {
  const [merged, setMerged] = useState(null);
  useEffect(() => {
    if (!geojson || !zipTotals) return;
    geojson.features.forEach((feature) => {
      const zip = feature.properties.ZIPCODE;
      const count = zipTotals[zip];
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
  const zipPolys = useGeoJSON("/data/travis_zips_simp.geo.json");
  let zipCentroids = useGeoJSON("/data/centroids.geo.json");
  zipCentroids = usedMergedGeojson(zipCentroids, zipTotals);
  const isMapLoaded = useMap(mapContainerRef, mapRef, zipPolys, zipCentroids);

  return (
    <div
      style={{ minHeight: 450, height: "100%", width: "100%" }}
      ref={mapContainerRef}
    ></div>
  );
}
