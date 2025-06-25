export default class Loader {
    constructor() {
        this.loader = null;
    }
    
    init() {
        this.loader = document.querySelector('.loader');
    }

    show() {
        document.body.style.overflow = 'hidden';
        this.loader.setAttribute('active', '');
    }
    
    hide() {
        document.body.style.overflow = '';
        this.loader.removeAttribute('active', '');
    }
}