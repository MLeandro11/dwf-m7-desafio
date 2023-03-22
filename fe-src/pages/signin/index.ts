import { Router } from "@vaadin/router";
import { state } from "../../state";
class SigninPage extends HTMLElement {
  dataUser;
  connectedCallback() {
    state.subscribe(() => {
      this.dataUser = state.getState();
    });
    this.render();
  }
  listeners() {
    const inputEmail: any = this.querySelector(".signin__form-input");
    const buttonEl = this.querySelector(".signin__form-button");

    buttonEl?.addEventListener("click", (e: any) => {
      if (!inputEmail.value.length) {
        return inputEmail.setAttribute("placeholder", "ingresar un email");
      }
      state.validateEmail(inputEmail.value, () => {
        this.redirect(this.dataUser.emailInDataBase);
      });

    }
    );
  }
  redirect(validEmail: Boolean) {
    if (!validEmail) {
      return Router.go("/profile");
    }
    const formEl: any = this.querySelector(".signin__form");
    formEl.innerHTML = /*html*/`
            <my-text type="title" align="center">Ingresar</my-text>
            <label class="signin__form-label">
                <span>CONTRASEÑA</span>
                <input class="signin__form-input" required name="name" type="password"/>
            </label>
            <my-button class="signin__form-button" type="primary">Ingresar</my-button>
        `;
    const inputPassword: any = this.querySelector(".signin__form-input");
    this.querySelector("my-button")?.addEventListener("click", (e: any) => {
      if (!inputPassword.value.length) {
        return inputPassword.setAttribute(
          "placeholder",
          "ingresar un password"
        );
      }
      const password = inputPassword.value;
      state.signIn(password, () => {
        if (this.dataUser.token) {
          return Router.go(this.dataUser.route);
        }
      });
    });
  }
  render() {
    this.innerHTML = /*html*/`
            
            <div class="container">
                <div class="signin__form">
                  <my-text type="title" align="center">Ingresar</my-text>
                  <label class="signin__form-label">
                    <span>Email</span>
                    <input class="signin__form-input" required name="name" type="email"/>
                  </label>
                  <my-button class="signin__form-button" type="primary">Siguiente</my-button>
                </div>    
            </div>    
        `;
    const style = document.createElement("style");
    style.innerHTML = /*css*/`
          .signin__form{
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .signin__form-label{
            display: flex;
            flex-direction: column;
            font-size: 16px; 
        }
        .signin__form-input{
            font-family: 'Poppins', sans-serif;
            padding: 8px 0;
            font-size: 16px; 
        }
        .signin__form-input::placeholder{
            color: red; 
        }
        `;
    this.appendChild(style);
    this.listeners();
  }
}
customElements.define("signin-page", SigninPage);
