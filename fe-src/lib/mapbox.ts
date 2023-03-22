import * as  mapboxgl from "mapbox-gl"
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN

mapboxgl.accessToken = MAPBOX_TOKEN

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "ar",
    autocomplete: true,
    language: "es",
    placeholder: 'Ej: "Obelisco - Plaza de la República"',
    marker: false,
});

function initMapMapbox(mapElement) {
    return new mapboxgl.Map({
        container: mapElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-63.616672, -38.416097],
        zoom: 4,
        dragPan: false,
        // cooperativeGestures: true,
        scrollZoom: false,
    });
}


export { initMapMapbox, geocoder }