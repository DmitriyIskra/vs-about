export default class Redraw {
    constructor(dialog) {
        this.dialog = dialog;
        this.close = this.dialog.querySelector('.dialog__close'); // кнопка закрыть
    }

    openDialog() {
        this.dialog.showModal();

        document.body.style.overflow = 'hidden';
    }

    closeDialog() {
        this.dialog.closeModal();

        document.body.style.overflow = '';
    }
}