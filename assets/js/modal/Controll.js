export default class Dialog {
    constructor(redraw) {
        this.redraw = redraw;
        
        this.click = this.click.bind(this);

        // при открытии dialog по необходимости (если есть форма), передается колбек с привязанным контекстом куда передавать данные
        // из формы для отправки, а на формы через цикл или по параметру вешать слушатель, с условиями и фильтрацией по e.target
        // и соответствующей для каждой формы логикой. 
        this.callbackSubmitApi = null;
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.redraw.close.addEventListener('click', this.click);
    }

    registerContentEvents(event) {
        this.redraw.dialog.addEventListener('click', this.click);
    }

    click(e) {
        if(e.target.closest('.dialog__close')) {
            this.closeDialog();
        }
    }

    openDialog(param) {
        this.redraw.openDialog(param);
    }
    
    closeDialog() {
        this.redraw.closeDialog();
    }
}