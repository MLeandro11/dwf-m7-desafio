class Button extends HTMLElement {

    shadow: ShadowRoot
    constructor() {
        super()
    }
    connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'open' })
        const type = this.getAttribute('type') || 'primary'
        const style = document.createElement('style')

        const customStyle = {
            primary: `
            background-color: #FF9DF5;
            color: #000;
            `,
            secondary: `
            background-color: #97EA9F;
            color: #000;
            `,
            cancel: `
            background-color: #C4C4C4;
            color: #000;
            `
        }

        style.innerHTML = /*css*/`

        .button{
            ${customStyle[type]};
            font-family: 'Poppins', sans-serif;
            border: none;
            border-radius: 8px;
            width: 100%;
            padding: 12px 3px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
        }
        :host([disabled]) .button{
            background-color: grey;
            cursor: not-allowed;
            color: white
        }
        .button:hover{
            opacity: 0.85;
        }
        `
        this.shadow.appendChild(style)
        this.render()
    }
    render() {
        const button = document.createElement('button')

        button.className = "button"
        button.textContent = this.textContent

        this.shadow.append(button)
    }
}
customElements.define('my-button', Button)

