import { Router } from "@vaadin/router";
import { state } from "../../state";

class ProfilePage extends HTMLElement {
  dataUser;
  connectedCallback() {
    state.subscribe(() => {
      this.dataUser = state.getState().dataUser;
    });
    const cs = state.getState();
    if (cs.emailInDataBase == false && !cs.token) {
      this.render();
      this.listenersRegister();
      return;
    }
    if (!cs.token) {
      state.setRouteToGo(location.pathname.slice(1))
      return Router.go("/signin");
    }
    this.pullProfile();
    this.render();
    this.listenersUpdateData();
  }
  listenersUpdateData() {
    const form: any = this.querySelector(".profile__form");
    const buttonEl = this.querySelector(".profile__form-button");

    let changeForm = {};

    form?.addEventListener("change", (e: any) => {
      changeForm[e.target.name] = e.target.value;
    });
    buttonEl?.addEventListener("click", (e) => {
      if (Object.keys(changeForm).length === 0) {
        return this.messageFormLog("debes modificar al menos un campo");
      }
      if (form["repeat-password"].value !== form["password"].value) {
        return this.messageFormLog("las contraseñas deben coicidir");
      } else {
        state.updateDataUser(changeForm, () => {
          location.reload()
        });
      }
    });
  }
  listenersRegister() {
    const form: any = this.querySelector(".profile__form");
    const buttonEl = this.querySelector(".profile__form-button");
    buttonEl?.addEventListener("click", () => {
      if (form.fullname.value == "" || form.password.value == "" || form['repeat-password'].value == "") {
        return this.messageFormLog("debes completar todos los campos")
      }
      if (form.password.value !== form['repeat-password'].value) {
        return this.messageFormLog("las contraseñas deben coicidir")
      }
      state.signUp(
        {
          fullname: form.fullname.value,
          password: form.password.value,
        },
        () => {
          Router.go("/signin");
        }
      );
    });
  }
  pullProfile() {
    state.getUser(() => {
      this.renderDataForm(this.dataUser);
    });
  }
  messageFormLog(message: string) {
    const messageEl: any = this.querySelector(".profile__form-message");
    messageEl.innerHTML = `
    <my-text type="caption" color="red" align="right">${message}</my-text>
    `
    return setTimeout(() => {
      messageEl.textContent = ""
    }, 3000);
  }
  renderDataForm(dataUser) {
    const form: any = this.querySelector(".profile__form");
    form.fullname.value = dataUser.fullname;
    form.password.value = dataUser.password;
    form["repeat-password"].value = dataUser.password;
  }
  render() {
    this.innerHTML = /*html*/`
            
            <div class="container">
                <div class="profile">
                <my-text type="title" align="center">Mis datos</my-text>
                <form class="profile__form">
                    <label class="profile__form-label">
                        <span>Nombre</span>
                        <input class="profile__form-input" name="fullname" type="text"/>
                    </label>
                    <label class="profile__form-label">
                        <span>Contraseña</span>
                        <input class="profile__form-input" name="password" type="password"/>
                    </label>
                    <label class="profile__form-label">
                        <span>Repetir contraseña</span>
                        <input class="profile__form-input" name="repeat-password" type="password"/>
                    </label>
                    <my-button class="profile__form-button">Guardar</my-button>
                    <div class="profile__form-message"></div>
                </form>
            </div>    
        `;
    const style = document.createElement("style");
    style.innerHTML =/*css*/ `
        .profile {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .profile__form{
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        .profile__form-label{
            display: flex;
            flex-direction: column;
            font-size: 16px; 
        }
        .profile__form-input{
            font-family: 'Poppins', sans-serif;
            padding: 8px 0;
            font-size: 16px; 
        }
        .profile__form-message{
          color: red;
          text-align: end;
        }
        `;
    this.appendChild(style);
  }
}
customElements.define("profile-page", ProfilePage);
