export default class Redraw {
    constructor(form) {
        this.form = form;
        // Обязательные текстовые инпуты
        this.requiredInputs = [...this.form.querySelectorAll('input[type="text"]')];

        // Email менеджера
        this.menedgerEmail = this.form['menedger-email'];
        // Телефон менеджера
        this.phones = [...this.form.querySelectorAll('[data-type="phone"]')];

        // Радио кнопки "Система налогообложения" и "НДС"
        this.requiredRadio = [[...this.form.taxation], [...this.form.nds]];

        // Заголовки радио кнопок "Система налогообложения" и "НДС"
        this.titlesRadio = {
            taxation: this.form.querySelector('.agent-reg__taxation-title'),
            nds: this.form.querySelector('.agent-reg__nds-title'),
        }

        // Заголовок и чекбокс персональных данных
        this.titlePersonData = this.form.querySelector('.agent-reg__agree-person-title');
        this.boxPersonData = this.form['person-data'];
    }

    // При добавлении еще одного адреса "Где купить" обновить массив телефонов
    updateInputsPhone() {
        this.phones = [...this.form.querySelectorAll('[data-type="phone"]')];
    }

    /**
     * @description устанавливает невалидность на переданный элемент 
     * @param element элемент для установки атрибута invalid 
     * */ 
    setInvalid(element) {
        element.setAttribute('invalid', '');
    }

    // снимает невалидность с формы (убирает атрибут invalid)
    removeInvalid(element) {
        element.removeAttribute('invalid');
    }
}