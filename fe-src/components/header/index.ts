import { Router } from "@vaadin/router"
import { state } from "../../state"

let logoURL = require('url:../../image/logo.svg')
let menuURL = require('url:../../image/ico-menu.svg')
let icoCloseURL = require('url:../../image/ico-close.svg')

class HeaderCustom extends HTMLElement {
    connectedCallback() {
        const dataUser = state.getState()
        this.render()
        state.subscribe(() => {
            this.userSession(dataUser)

        })
    }
    userSession(dataUser) {
        if (dataUser.token) {
            const userSessionEl: any = this.shadowRoot?.querySelector('.session')
            userSessionEl.innerHTML = /*html*/`
            <my-text type="subtitle-secondary" color="white" align="center">${dataUser.email}</my-text>
            <my-text class="session__close" type="link" color="#C6558B" align="center">Cerrar sesión</my-text>
            `
            const closeSessionEl = this.shadowRoot?.querySelector<HTMLElement>('.session__close');
            closeSessionEl?.addEventListener('click', () => {
                localStorage.removeItem('user-data');
                location.reload();
            });
        }
    }
    listeners() {
        const menuEl: any = this.shadowRoot?.querySelector<HTMLElement>('.menu');
        const logoEl = this.shadowRoot?.querySelector<HTMLElement>('.header__logo');
        const openEl = this.shadowRoot?.querySelector<HTMLElement>('.header__open');
        const closeEl = this.shadowRoot?.querySelector<HTMLElement>('.menu__close');
        const profileEl = this.shadowRoot?.querySelector<HTMLElement>('.menu__profile');
        const petsEl = this.shadowRoot?.querySelector<HTMLElement>('.menu__pets');
        const reportEl = this.shadowRoot?.querySelector<HTMLElement>('.menu__report');

        openEl?.addEventListener('click', () => {
            menuEl.style.display = 'flex';
        });

        closeEl?.addEventListener('click', () => {
            menuEl.style.display = '';
        });

        logoEl?.addEventListener('click', () => {
            menuEl.style.display = '';
            Router.go('/')
        });
        profileEl?.addEventListener('click', () => {
            menuEl.style.display = '';
            Router.go('/profile')
        });

        petsEl?.addEventListener('click', () => {
            menuEl.style.display = '';
            Router.go('/my-pets')
        });

        reportEl?.addEventListener('click', () => {
            menuEl.style.display = '';
            Router.go('/report')
        });

    }
    render() {
        let shadow = this.attachShadow({ mode: "open" })
        const header = document.createElement('header')
        const { token, email } = state.getState()
        header.innerHTML = /*html*/`
            <div class="header">
                <img class="header__logo" src="${logoURL}" width="40px" height="34px" alt="logo">
                <img class="header__open" src="${menuURL}" width="60px" height="40px" alt="ico-menu">
                <div class="menu">
                    <img class="menu__close" src="${icoCloseURL}" width="60px" height="40px" alt="ico-menu">
                    <ul>
                        <li class="menu__profile">Mis datos</li>
                        <li class="menu__pets">Mis mascotas reportadas</li>
                        <li class="menu__report">Reportar mascota</li>
                    </ul>
                    <div class="session">
                    </div>
                </div>
            </div>
            
        `
        const style = document.createElement('style')
        style.innerHTML = /*css*/`
        .header{
            background-color: #FF8282;
            padding: 13px 20px;
            display: flex;
            min-width: 250px;
            justify-content: space-between;
            align-items: center;
        }
        @media (min-width: 600px) {
            .header{
                padding: 20px 40px;
            }
        } 
        .menu{
            display: none;
            flex-direction: column;
            justify-content: space-evenly;
            position: fixed;
            z-index: 99;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            background: #000000;
            opacity: 0.9;
        }
        @media (min-width: 600px) {
            .menu{
                left: initial;
                padding: 0 25px;
            }
        }  
        .menu > ul {
            list-style-type: none;
            font-family: 'Poppins', sans-serif;
            text-align: center;
            color:white;
            font-size: 24px;
            font-weight: 700;
            display: grid;
            gap: 45px;
            padding: 0;
            margin: 0;
        }
        .menu__close{
            position: absolute;
            right: 25px;
            top: 30px;
        }
        `
        shadow.append(header, style)
        this.listeners()
    }
}
//definimos el custom elemento para usarlo en el HTML
customElements.define('header-custom', HeaderCustom)


