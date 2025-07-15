export default class Controll {
    constructor(redraw) {
        this.redraw = redraw;
        
        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();

        this.redraw.startPage();
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    click(e) {
        e.preventDefault();

        // Переключение контента
        if(e.target.closest('.lkt__cont-switcher')) {
            const target = e.target.closest('.lkt__cont-switcher');
            const param = target.dataset.item;

            this.redraw.switchContent(param); // переключили контент

            // скрываем документы, но только если переключатель не запрос на изменение или на аннуляцию
            if(param !== 'change' && param !== 'annulation') this.redraw.hideAsideDocs();

            if(param !== 'order') this.redraw.changeSwitcher(target); // сменили активный переключатель
            
            // показываем документы при открытии заказа
            if(param === 'order') this.redraw.showAsideDocs();
        }


        // ORDER
        // Открытие закрытие аккордиона (down opener)
        if(e.target.closest('.lkt__down-opener')) {
            const target = e.target.closest('.lkt__down-opener');
            this.redraw.controllOpener(target);
        }
    }
}