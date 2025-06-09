export default class ControllAboutUs {
    constructor(redraw) {
        this.redraw = redraw;
        
        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    click(e) {
        e.preventDefault();

        if(e.target.closest('')) {

        }
    }
}