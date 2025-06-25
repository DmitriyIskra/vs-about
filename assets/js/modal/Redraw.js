export default class Redraw {
    constructor(dialog) {
        this.dialog = dialog;
        this.close = this.dialog.querySelector('.dialog__close'); // кнопка закрыть

        this.currentParam = null;
    }

    // открытие модалки с аттрибутом соответствующего контента
    /**
     * success - передача данных успешна
     * fail - передача данных не успешна
     * */ 
    openDialog(param) {
        this.currentParam = param;
        this.dialog.setAttribute(this.currentParam, '')
        this.dialog.showModal();

        document.body.style.overflow = 'hidden';
    }

    closeDialog() {
        this.dialog.close();
        this.dialog.removeAttribute(this.currentParam)

        document.body.style.overflow = '';
    }
}