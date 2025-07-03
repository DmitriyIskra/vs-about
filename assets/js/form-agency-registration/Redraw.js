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

        // Блок для написания адреса "Где купить"
        this.listAddress = this.form.querySelectorAll('.agent-reg__list_where-buy');

        // Кнопка submit
        this.submitButton = this.form.querySelector('.agent-reg__send-button');
    }

    // При добавлении еще одного адреса "Где купить" обновить данные формы
    updateData() {
        this.requiredInputs = [...this.form.querySelectorAll('input[type="text"]')];
        this.phones = [...this.form.querySelectorAll('[data-type="phone"]')];
        this.listAddress = this.form.querySelectorAll('.agent-reg__list_where-buy');
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

    
    /**
     * @description Добавляем еще один адрес "Где купить"
     * @param callback регистрация маски для поля телефон
     * */ 
    addAddress(callback) {
        // получаем клон элемента
        const clone = this.listAddress[0].cloneNode(true);
        clone.style.paddingTop = '1vw';
        // очищаем инпуты клона, на случай если у оригинала они были заполненны
        // и задаем им новые имена (добавляем номер по порядкеу)
        const inputsClone = [...clone.querySelectorAll('input[type="text"]')];
        inputsClone.forEach(input => {
            input.value = '';

            const newName = `${input.name}-${this.listAddress.length + 1}`;
            input.name = newName;

            if(input?.dataset?.type === 'phone') callback(input);
        });

        const lastList = this.listAddress[this.listAddress.length - 1];

        lastList.after(clone);
        this.updateData();
    }

    // Включает - выключает кнопку submit
    stateSubmitButton() {
        this.submitButton.classList.toggle('agent-reg__send-button_active');
    }
}