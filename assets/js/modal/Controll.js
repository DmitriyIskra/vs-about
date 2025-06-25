export default class Dialog {
    constructor() {
        this.redraw = null;
        
        this.click = this.click.bind(this);
    }

    async init() {
        await this.registerRedraw();

        this.registerEvents();
    }

    async registerRedraw() {
        const dialog = document.querySelector('dialog');
        const Redraw = (await (import('./Redraw.js'))).default;
        this.redraw = new Redraw(dialog);
    }

    registerEvents() {
        this.redraw.dialog.addEventListener('click', this.click);
    }

    registerContentEvents(event) {
        this.redraw.dialog.addEventListener('click', this.click);
    }

    click(e) {
        e.preventDefault();

        if(e.target.closest('')) {

        }
    }
}