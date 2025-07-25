export default class Loader {
    constructor() {
        this.loader = null;
    }
    
    init() {
        this.loader = document.querySelector('.loader');
    }

    show() {
        if(innerWidth > 1024) {
            document.body.style.paddingRight = `${innerWidth - document.body.offsetWidth}px`;
        }

        document.body.style.overflow = 'hidden';
        this.loader.setAttribute('active', '');

    }
    
    hide() {
        document.body.style.overflow = '';
        this.loader.removeAttribute('active', '');

        document.body.style.paddingRight = '';
    }
}