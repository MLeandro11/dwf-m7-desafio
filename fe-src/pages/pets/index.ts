import { Router } from '@vaadin/router';
import { state } from '../../state';
class MyPetsPage extends HTMLElement {
    myPetsLost
    connectedCallback() {
        const cs = state.getState()
        if (!cs.token) {
            state.setRouteToGo(location.pathname.slice(1))
            return Router.go('/signin')
        }
        state.getMyPetsLost()
        state.subscribe(() => {
            this.myPetsLost = state.getState().myPetsLost
            this.render()
        })
    }
    listeners() {
        this.querySelector(".pets__list-reports")?.addEventListener("report", (e: any) => {
            state.petToEdit(e.detail)
        });
        this.querySelector(".pets__list-reports")?.addEventListener("post", (e: any) => {
            state.petToEdit(e.detail)
            state.updatePet({ lost: true }, () => {
                window.location.reload();
            })
        });
    }
    render() {
        this.innerHTML =/*html*/ `
        <div class="container">
            <div class="pets">
            <my-text type="title" align="center">Mis mascotas reportadas</my-text>
            <div class="pets__list-reports">
                ${this.myPetsLost.map((item) =>/*html*/`
                    <div class="pets__report">
                        <card-report 
                        photo="${item.picture_URL}" 
                        name="${item.name}"
                        pet-id="${item.id}"
                        comments="${item.reports.length}"
                        lost="${item.lost}"
                        >
                        </card-report>
                        <div class="report__comments">
                        <my-text type="subtitle">Reportes:</my-text>
                        ${item.reports.length == 0 ?
                        /*html*/`
                        <my-text type="text-secondary">No hay comentarios</my-text>` : item.reports.map(i =>
                        /*html*/`
                        <div class="report__comments-messages">
                        <my-text type="text">${i.reporter}:</my-text>
                        <my-text type="text-secondary">${i.message}</my-text>
                        <my-text type="link" color="#3E91DD">${i.phone_number}</my-text>
                        </div>
                        `).join("")}
                        </div>
                    </div>
                
                `).join("")}
            </div>    
            </div>
        `
        const style = document.createElement('style')
        style.innerHTML =/*css*/ `
        .pets {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .pets__list-reports{
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .pets__report{
            display: grid;
            grid-template-columns: 300px 1fr;
            grid-template-rows: 300px;
            border: 3px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
        }
        @media (max-width: 600px) {
            .pets__report{
                grid-template-columns: 1fr;
                height: 500px
            }
        }
        .report__comments{
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin: 5px;
            border-radius: 12px;
            overflow: scroll;
        }
        .report__comments::-webkit-scrollbar {
            -webkit-appearance: none;
        }
        .report__comments::-webkit-scrollbar:horizontal {
            display: none;
        }
        .report__comments::-webkit-scrollbar:vertical {
            width: 10px;
        }
        .report__comments::-webkit-scrollbar-thumb {
            background-color: #797979;
            border-radius: 20px;
            border: 2px solid #f1f2f3;
        }
        .report__comments::-webkit-scrollbar-track {
            border-radius: 10px;  
        }
        .report__comments-messages{
            background-color: lavender;
            padding: 5px;
            border-radius: 7px;
        }
        `
        this.appendChild(style)
        this.listeners();
    }
}
customElements.define('pets-page', MyPetsPage)