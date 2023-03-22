import { Router } from "@vaadin/router"
import { initMapMapbox, geocoder } from "../../lib/mapbox";
import { initDropzone } from "../../lib/dropzone";
import { state } from '../../state';
import * as  mapboxgl from "mapbox-gl"
class ReportEditPage extends HTMLElement {
  petData
  connectedCallback() {
    const cs = state.getState();
    if (!cs.pet) {
      state.setRouteToGo(location.pathname.slice(1));
      return Router.go("/my-pets");
    }
    this.petData = cs.pet
    this.render();
  }

  renderDataPet(dataPet) {
    const inputNameEl: any = this.querySelector(".report__form-label > input");
    const imgEl: any = this.querySelector(".report__form-dropzone > img");
    imgEl.src = dataPet.picture_URL

  }
  listeners() {
    const mapEl = this.querySelector(".report__form-mapbox-map");
    const inputNameEl = this.querySelector(".report__form-label > input");
    const messageEl: any = this.querySelector(".report__form-message");
    const buttonSaveEl = this.querySelector(".report__form-button-save");
    const buttonLocEl = this.querySelector(".report__form-button-located");
    const buttonUnpublishEl = this.querySelector(".report__form-button-Unpublish");
    let changeData = {};

    inputNameEl?.addEventListener("change", (e: any) => {
      changeData['name'] = e.target.value;
    })
    this.dataDropzone(changeData);
    this.dataMapbox(mapEl, changeData);

    buttonSaveEl?.addEventListener("click", () => {
      if (Object.keys(changeData).length === 0) {
        messageEl.innerHTML = `
        <my-text type="caption" color="red" align="right">Debes modificar al menos un campo</my-text>
        `
        return;
      }
      state.updatePet(changeData, () => {
        return Router.go('/my-pets');

      });
    })
    buttonLocEl?.addEventListener("click", () => {
      state.deletePet(() => {
        return window.location.reload();
      })
    })
    buttonUnpublishEl?.addEventListener("click", () => {
      state.updatePet({ lost: false }, () => {
        return window.location.reload();

      });
    })
  }
  dataMapbox(mapEl: Element | null, dataPet: {}) {
    const map = initMapMapbox(mapEl);
    const marker = new mapboxgl.Marker()
      .setLngLat([this.petData.lng, this.petData.lat])
      .addTo(map);
    map.setCenter([this.petData.lng, this.petData.lat]);
    map.setZoom(14);
    this.querySelector(".report__form-geocoder-search")?.appendChild(geocoder.onAdd(map))
    geocoder.on('result', function (e) {
      const result = e.result;
      const [lng, lat] = result.geometry.coordinates;
      marker.setLngLat([lng, lat])
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
          <my-text type="title" align="center">Editar mascota perdida</my-text>
            <div class="report__form">
              <label class="report__form-label">
                <span>Nombre</span>
                <input required name="fullname" value="${this.petData.name}" type="text"/>
              </label>
              <div class="report__form-dropzone">
                <img class='report__form-dropzone-img' src='${this.petData.picture_URL}' crossorigin='anonymous'>
                <my-button type="secondary" class="report__form-dropzone-button">agregar/modificar foto</my-button>
              </div>
              <div class="report__form-mapbox">
                <div class="report__form-mapbox-map" style='width: 100%; height: 300px;'></div>
                <div class='report__form-geocoder-search'></div>
              </div>
              <my-text type="caption" align="center">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</my-text>
              <my-button class="report__form-button-save" >Guardar</my-button>
              <my-button type="secondary" class="report__form-button-located">Reportar como encontrado</my-button>
              <my-text class="report__form-button-Unpublish" type="link" color="#FF3A3A" align="center">Despublicar</my-text>
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
customElements.define("report-edit", ReportEditPage);