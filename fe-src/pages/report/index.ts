import { Router } from "@vaadin/router";
import { state } from "../../state";
import * as  mapboxgl from "mapbox-gl"
import { initMapMapbox, geocoder } from "../../lib/mapbox";
import { initDropzone } from "../../lib/dropzone";
let imageReport = require('url:../../image/image-report.svg')

class ReportPage extends HTMLElement {
  connectedCallback() {
    const cs = state.getState();
    if (!cs.token) {
      state.setRouteToGo(location.pathname.slice(1));
      return Router.go("/signin");
    }
    this.render();
  }

  listeners() {
    const mapEl = this.querySelector(".report__form-mapbox-map");
    const inputNameEl = this.querySelector(".report__form-label > input");
    const buttonSubmitEl = this.querySelector(".report__form-button");
    const buttonCancelEl = this.querySelector(".report__form-button-cancel");
    const messageEl: any = this.querySelector(".report__form-message");

    let dataPet = {}

    inputNameEl?.addEventListener("input", (e: any) => {
      dataPet['name'] = e.target.value;
    })
    this.dataDropzone(dataPet);
    this.dataMapbox(mapEl, dataPet);

    buttonSubmitEl?.addEventListener("click", () => {
      if (['dataURL', 'name', 'lat', 'lng'].some(prop => !dataPet[prop])) {
        return messageEl.innerHTML = `
        <my-text type="caption" color="red" align="right">Debes completar todos los campos</my-text>
        `
      }
      state.reportMyPet(dataPet, () => {
        //Router.go("/my-pets");
        window.location.reload();
      });
    })
    buttonCancelEl?.addEventListener("click", () => {
      Router.go("/");

    })
  }

  dataMapbox(mapEl: Element | null, dataPet: {}) {
    const map = initMapMapbox(mapEl);
    this.querySelector(".report__form-geocoder-search")?.appendChild(geocoder.onAdd(map))
    geocoder.on('result', function (e) {
      const result = e.result;
      const [lng, lat] = result.geometry.coordinates;
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
      map.setCenter([lng, lat]);
      map.setZoom(14);
      dataPet['lat'] = lat;
      dataPet['lng'] = lng;
      dataPet['location'] = result.text;
    });
  }

  dataDropzone(dataPet: {}) {
    const imgPet: any = this.querySelector(".report__form-dropzone-img");
    const myDropzone = initDropzone(".report__form-dropzone-button")
    myDropzone.on("thumbnail", function (file) {
      imgPet.src = file.dataURL;
      dataPet['dataURL'] = file.dataURL;
    });
  }

  render() {
    this.innerHTML = /*html*/`
    
    <div class="container">
      <div class="report">
      <my-text type="title" align="center">Reportar mascota perdida</my-text>
      <div class="report__form">
        <label class="report__form-label">
          <span>Nombre</span>
          <input required name="fullname" type="text"/>
        </label>
        <div class="report__form-dropzone">
          <img class='report__form-dropzone-img' src=${imageReport} crossorigin='anonymous'>
          <my-button type="secondary" class="report__form-dropzone-button">agregar/modificar foto</my-button>
        </div>
        <div class="report__form-mapbox">
          <div class="report__form-mapbox-map" style='width: 100%; height: 300px;'></div>
          <div class='report__form-geocoder-search'></div>
        </div>
        <my-text type="caption" align="center">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</my-text>
        <my-button class="report__form-button" >Guardar</my-button>
        <my-button type="cancel" class="report__form-button-cancel">Cancel</my-button>
        <div class="report__form-message"></div>
      </div>
      </div>
    </div> `;

    const style = document.createElement("style");
    style.innerHTML = /*css*/`
        .report {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .report__form{
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .report__form-label,
        .report__form-mapbox-label{
          display: flex;
          flex-direction: column;
          font-size: 16px;
        }
      .report__form-label > input,
      .report__form-mapbox-label > input{
        font-family: 'Poppins', sans-serif;
        padding: 8px 0;
        font-size: 16px;
      }

      .report__form-dropzone-img{
        width: 100%;
        object-fit: contain;
        height: 150px;
      }
      .report__form-dropzone,
      .report__form-mapbox{
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .report__form-mapbox-map{
        margin: 0 auto;
      }
      .report__form-geocoder-search > .mapboxgl-ctrl-geocoder{
        width: 100%;
        max-width: none
      }
      `;
    this.appendChild(style);
    this.listeners();
  }
}
customElements.define("report-page", ReportPage);
