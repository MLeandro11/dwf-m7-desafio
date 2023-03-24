let icoCloseModalURL = require('url:../../image/ico-close.svg')

class Card extends HTMLElement {
  petId
  photo
  name
  location
  constructor() {
    super();
    this.petId = this.getAttribute("pet-id");
    this.photo = this.getAttribute("photo");
    this.name = this.getAttribute("name");
    this.location = this.getAttribute("location");
  }
  connectedCallback() {
    this.render();

  }
  listeners() {
    const modal: any = this.querySelector(".modal")
    this.querySelector(".card__info-report")?.addEventListener("click", (e) => {
      modal.style.display = "initial"
    });
    this.querySelector(".modal__icon-close")?.addEventListener("click", (e) => {
      modal.style.display = "none"
    });

    const form: any = this.querySelector(".modal__form")
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.dispatchEvent(
        new CustomEvent("report", {
          detail: {
            reporter: e.target.name.value,
            phone_number: e.target.phone.value,
            message: e.target.message.value,
            petId: this.petId
          },
          bubbles: true
        })
      );
      form.reset()
      modal.style.display = "none"
    });

  }
  render() {
    this.innerHTML = /*html*/`
        <div class="card">
            <div class="card__image">
            <img src="${this.photo}" alt="">
            </div>
            <div class="card__info">
              <div class="card__info-name">
                <my-text type="text" class="title">${this.name}</my-text>
                <my-text type="text-secondary" class="title">${this.location}</my-text>
              </div>
                <my-text type="link" align="end" color="#3E91DD" class="card__info-report">reportar informacion</my-text>
            </div>
            </div>
            <div class="modal">
              <form class="modal__form">
                <div class="modal__icon-cnt">
                  <img class="modal__icon-close" src="${icoCloseModalURL}" width="40x" height="40px" alt="ico-modal">
                </div>
                <my-text type="subtitle" class="title">Reportar info de ${this.name}</my-text>
                <label class="modal__form-label">
                  <span>TU NOMBRE</span>
                  <input class="modal__form-input" required name="name" type="text"/>
                </label>
                <label class="modal__form-label">
                  <span>TU TELEFONO</span>
                  <input class="modal__form-input" required name="phone" type="number"/>
                </label>
                <label class="modal__form-label">
                  <span>Donde lo viste?</span>
                  <textarea required class="modal__form-message" name="message"></textarea>
                </label>
                <button class="modal__form-btn">Enviar</button>
              </form>
            </div>
      `;
    const style = document.createElement('style')
    style.innerHTML = /*css*/`
      .card{
          display: grid; 
          grid-template-columns: 300px; 
          grid-template-rows: 300px 100px; 
          overflow: hidden;
          border-radius: 10px;
          border: 3px solid #e0e0e0;
      }
      .card__image{
          width: 100%;
          height: 100%;
      }
      .card__image > img{
          object-fit: cover;
          width: 100%;
          height: 100%;
      }
      .card__info{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
      }
      .card__info-name{
        overflow: hidden;
      }
      .modal{
        display: none;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(0,0,0,0.5);
      }
      .modal__form{
        position: relative;
        font-family: 'Poppins';
        border-radius: 4px;
        background-color: white;
        margin: 90px 35px 0;
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding: 20px;
      }
      @media (min-width: 600px){
        .modal__form{
          margin: 90px auto 0;
          max-width: 575px
        }
      }
      .modal__form-label{
        display: flex;
        flex-direction: column;
        font-size: 16px; 
      }
      .modal__form-input{
        font-family: 'Poppins', sans-serif;
        padding: 8px 0;
        font-size: 16px; 
      }
      .modal__form-message{
        font-family: 'Poppins', sans-serif;
        padding: 8px 0;
        font-size: 16px;
      }
      .modal__form-btn{
        background-color: #FF9DF5;
        font-family: 'Poppins', sans-serif;
        border: none;
        border-radius: 8px;
        padding: 12px 0;
        font-size: 16px;
        font-weight: 700;
      }
      .modal__icon-cnt{
        display: flex;
        justify-content: flex-end;
      }
      .modal__icon-close{
        background-color: black;
        border: 3px solid;
        border-radius: 50%;
      }
      `

    this.append(style)
    this.listeners();
  }
}
customElements.define('card-pets', Card)