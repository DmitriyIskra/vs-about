export default class Redraw {
    constructor(el) {
        this.el = el;
        this.contentWrapper = this.el.querySelector('.lkt-main__content');
        this.asideDocs = this.el.querySelector('.lkt-docs');

        // активный контент
        this.currentActiveContent = this.contentWrapper.children[0];        
        // активный элемент переключатель контента
        this.currentActiveSwitcher = this.el.querySelector('.lkt__header-list').children[0];        
    }

    switchContent(param) {
        this.contentWrapper.dataset.content = param;
    }
    
    changeSwitcher(el) {
        this.currentActiveSwitcher.classList.remove('lkt__cont-switcher_active');
        el.classList.add('lkt__cont-switcher_active');
        this.currentActiveSwitcher = el;
    }

    showAsideDocs() {
        this.asideDocs.classList.add('lkt-docs__active');
    }
    
    hideAsideDocs() {
        if(this.asideDocs.classList.contains('lkt-docs__active')) {
            this.asideDocs.classList.remove('lkt-docs__active');
        }
    }
}