export default class Redraw {
    constructor(dialog) {
        this.dialog = dialog;
        this.close = this.dialog.querySelector('.dialog__close'); // кнопка закрыть

        this.currentParam = null;
    }

    // открытие модалки с аттрибутом соответствующего контента
    /**
     * @param - параметр который указывает контент какой формы показывать
     * @example success - передача данных успешна
     * @example fail - передача данных не успешна
     * */ 
    openDialog(param) {
        // высота скрола
        const scrollData = scrollY;

        this.currentParam = param;
        this.dialog.setAttribute(this.currentParam, '')
        this.dialog.showModal();

        // установка страницы на месте, без скроллинга вверх при установке overflow = 'hidden'
        document.body.style.overflow = 'hidden';
        
        scrollTo(0, scrollData);
    }

    closeDialog() {
        this.dialog.close();
        this.dialog.removeAttribute(this.currentParam)

        document.body.style.overflow = '';
        this.dialog.style.top = '';
    }
}