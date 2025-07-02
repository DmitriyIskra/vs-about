export default class Redraw {
    constructor(el) {
        this.el = el;

        // Блок в котором форма
        this.support = this.el.querySelector('.corp-cl__support');
        // элемент в котором swiper
        this.swEl = this.el.querySelector('.corp-cl__sw');
        // Блок строк в баннере, которые должны чередоваться
        this.fadeItemsWrapper = this.el.querySelector('.corp-cl__banner-text-dinamic');

        // экземпляр объекта swiper
        this.swInstance = null;
        this.fadeCurrentEl = this.fadeItemsWrapper.firstElementChild;

        // Длительность анимации ддля строки в баннере
        // this.durationFade = parseFloat(getComputedStyle(this.fadeCurrentEl).transitionDuration) * 1000;
    }

    // запускает исчезновение и появление строки в баннере
    startFade(timeOut) {
        this.fadeRow(timeOut);
    }
    // механизм fade для строки в баннере
    fadeRow(timeOut) {
        let nextElement = this.fadeCurrentEl.nextElementSibling;
        if(!nextElement) nextElement = this.fadeItemsWrapper.firstElementChild;

        nextElement.addEventListener('transitionend', () => {
            this.fadeRow(timeOut);
        }, {once: true});
        
        setTimeout(() => {
            this.fadeCurrentEl.removeAttribute('data-active');
            this.fadeCurrentEl = nextElement;
            this.fadeCurrentEl.dataset.active = "true";
        }, timeOut)
    }
}