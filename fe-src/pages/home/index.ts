import { Router } from "@vaadin/router";
import { state } from "../../state";
class HomePage extends HTMLElement {
  connectedCallback() {
    const cs = state.getState()
    this.render();
    if (cs.lat && cs.lng) {
      this.createCardsPets(cs.pets);
    }
  }

  listeners() {
    this.querySelector(".home__main-button")?.addEventListener("click", (e: any) => {
      const location = window.navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          state.setLocation(latitude, longitude);
          state.getPetsLost(() => {
            const pets = state.getState().pets
            this.createCardsPets(pets);
          });
        }
      );
    });
  }
  createCardsPets = (petsLost) => {
    const mainEl: any = this.querySelector(".home__main");
    if (petsLost?.length == 0) {
      return mainEl.innerHTML = /*html*/`
            <my-text type="title">No se encontaron mascotas cerca tuyo</my-text>
            `;
    }
    mainEl.innerHTML = /*html*/`
      <div class="home__list">
      ${petsLost
        .map(
          (i) =>
            `<card-pets
             photo="${i.photo}" 
             name="${i.name}" 
             location="${i.location}" 
             pet-id="${i.objectID}"></card-pets>`
        )
        .join("")}
      </div>
          `;
    mainEl.addEventListener("report", (e: any) => {
      state.sendReport(e.detail);
    });
  };

  render() {
    this.innerHTML = /*html*/`

        <div class="container">
          <div class="home">
            <div class="home__main">
              <my-text type="title">Mascotas perdidas cerca tuyo</my-text>
              <my-text type="caption" align="center">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</my-text>
              <my-button class="home__main-button" type="primary">Dar mi ubicación</my-button>
            </div>
          </div>
        </div>
        `;
    const style = document.createElement("style");
    style.innerHTML = /*css*/`
          .home {
            padding: 20px;
          }
          .home__main{
            display: flex;
            flex-direction: column;
            gap: 20px;   
          } 
          .home__list{
            align-items: center;  
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        `;
    this.appendChild(style);
    this.listeners();
  }
}
customElements.define("my-home", HomePage);
