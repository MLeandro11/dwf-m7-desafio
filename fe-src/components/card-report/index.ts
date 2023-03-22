import { Router } from "@vaadin/router"
import { state } from '../../state';
let icoEdit = require('url:../../image/ico-edit.svg')

class CardReport extends HTMLElement {
    petId
    photo
    name
    lost
    constructor() {
        super();
        this.petId = this.getAttribute("pet-id");
        this.photo = this.getAttribute("photo");
        this.name = this.getAttribute("name");
        this.lost = this.getAttribute("lost");
    }
    connectedCallback() {
        this.render();

    }
    listeners() {
        const editEL = this.querySelector('.card__info > img')
        const postEL = this.querySelector('.card__link-post')
        postEL?.addEventListener("click", () => {
            this.dispatchEvent(
                new CustomEvent("post", {
                    detail: {
                        petId: this.petId
                    },
                    bubbles: true
                })
            );

        })
        editEL?.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent("report", {
                    detail: {
                        petId: this.petId
                    },
                    bubbles: true
                })
            );
            Router.go('/report/edit-pet')
        })
    }
    render() {
        this.innerHTML = /*html*/`
        <div class="card">
            <div class="card__img">
                <img src="${this.photo}" alt="">
            </div>
            <div class="card__info">
                <my-text type="text">${this.name}</my-text>
                ${JSON.parse(this.lost) ?
                `<img src="${icoEdit}" width="24px" height="24px" alt="ico-edit" />` :
                `<my-text class="card__link-post" color="#3E91DD" type="link">publicar</my-text>`
            }  
            </div>
        </div>
      `;
        const style = document.createElement('style')
        style.innerHTML = /*css*/`
        .card{
            border-radius: 4px;
            background-color: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            width: 100%;
        }
        .card__img{
            height: 200px;
            flex: 1;
            width: 100%;
        }
        .card__img > img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            
        }
        .card__info{
            display: flex;
            justify-content: space-between;
            padding: 10px;
            align-items: center;
        }
        .card__info > img{
            cursor: pointer;
        }
      `

        this.append(style)
        this.listeners();
    }
}
customElements.define('card-report', CardReport)