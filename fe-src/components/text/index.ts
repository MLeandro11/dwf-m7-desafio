class Paragraph extends HTMLElement {
    shadow: ShadowRoot
    constructor() {
        super()
    }
    connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'open' })
        const type = this.getAttribute('type') || 'title'
        const align = this.getAttribute('align') || 'left'
        const color = this.getAttribute('color') || '#000000'
        const style = document.createElement('style')
        const customStyle = {
            title: `
                font-size: 40px;
                font-weight: 700;
            `,
            subtitle: `
                font-size: 24px;
                font-weight: 700;
            `,
            'subtitle-secondary': `
                font-size: 24px;
                font-weight: 400;
            `,
            text: `
                font-size: 16px;
                font-weight: 700;
            `,
            'text-secondary': `
                font-size: 16px;
                font-weight: 400;
            `,
            caption: `
                font-size: 16px;
                font-weight: 500;
                text-transform: uppercase;
            `,
            link: `
                font-size: 16px;
                font-weight: 500;
                text-transform: uppercase;
                text-decoration: underline;
                cursor: pointer;
            `
        }

        style.innerHTML = /*css*/`
        .body{
            font-family: 'Poppins', sans-serif;
            margin: 0px;
            ${customStyle[type]};
            color: ${color};
            text-align: ${align};
        }
        `
        this.shadow.append(style)
        this.render()
    }
    render() {
        const p = document.createElement('p')

        p.className = "body"
        p.textContent = this.textContent

        this.shadow.append(p)
    }
}
customElements.define('my-text', Paragraph)



