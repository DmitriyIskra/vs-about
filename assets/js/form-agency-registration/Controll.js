export default class Controll {
    constructor(redraw, validation, submitApi, loaderApi, dialogApi) {
        this.redraw = redraw;
        this.validation = validation;
        this.submitApi = submitApi;
        this.loaderApi = loaderApi;
        this.dialogApi = dialogApi;
       
        this.click = this.click.bind(this);
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
        this.registerPhoneMask = this.registerPhoneMask.bind(this)
    }

    init() {
        this.registerEvents();

        this.loaderApi.init();
        this.dialogApi.init();
        // вешаем маски на поля для ввода телефона
        this.redraw.phones.forEach(input => this.registerPhoneMask(input));
    }

    registerEvents() {
        this.redraw.form.addEventListener('click', this.click);
        this.redraw.form.addEventListener('submit', this.submit);
        this.redraw.boxPersonData.addEventListener('change', this.change);
    }

    registerPhoneMask(input) {
        if(IMask) {
            const maskOptions = {
                mask: '+7 (000) 000-00-00',
                // lazy: false,
                // placeholderChar: '0',
            };
    
            IMask(input, maskOptions);
        }
    }

    click(e) {
        let target;
        // снять invalid c выбранного текстового поля
        if(e.target.matches('input[type="text"]')) {
            target = e.target.closest('input[type="text"]');
            if(target.hasAttribute('invalid')) this.redraw.removeInvalid(target);
        }
        // снять invalid c выбранного радио поля
        if(e.target.matches('input[type="radio"]')) {
            target = e.target.closest('input[type="radio"]');
            
            if(this.redraw.titlesRadio[target.name].hasAttribute('invalid')) 
                this.redraw.removeInvalid(this.redraw.titlesRadio[target.name]);
        }
        // снять invalid c согласия на обработку персональных данных
        if(e.target.matches('input[type="checkbox"]') && e.target.name === 'person-data') {           
            if(this.redraw.titlePersonData.hasAttribute('invalid'))
                this.redraw.removeInvalid(this.redraw.titlePersonData);
        }


        // Добавить еще адрес к "Где купить"
        if(e.target.closest('.agent-reg__add-address-button')) {
            this.redraw.addAddress(this.registerPhoneMask);
        }
    }

    // Для кнопки согласия с обработкой персональных данных
    // Включает - выключает кнопку submit
    change(e) {
        this.redraw.stateSubmitButton();
    }

    async submit(e) {
        e.preventDefault();

        // Все ли ОБЯЗАТЕЛЬНЫЕ ТЕКСТОВЫЕ ПОЛЯ заполнены  
        const noValidInputsText = this.validation.isFilledInputsText(this.redraw.requiredInputs);
        if(Array.isArray(noValidInputsText) && noValidInputsText.length) {
            noValidInputsText.forEach(input => this.redraw.setInvalid(input));
        } 

        // Все ли ОБЯЗАТЕЛЬНЫЕ РАДИО КНОПКИ нажаты
        let incorrectRadio = []; // массив не включенных радио кнопок, если таковые имеются
        this.redraw.requiredRadio.forEach(inputs => {
            const result = this.validation.validationRadio(inputs);

            if(!result) {
                incorrectRadio.push(inputs);
                this.redraw.setInvalid(this.redraw.titlesRadio[inputs[0].name]);
            };
        });

        // Выбран ли ОБЯЗАТЕЛЬНЫЙ ЧЕКБОКС для принятия соглашения
        // о персональных данных
        let isCorrectParsonalData = this.validation.validationCheckbox(this.redraw.boxPersonData);
        if(!isCorrectParsonalData) {
            this.redraw.setInvalid(this.redraw.titlePersonData);
        }

        // есть ли среди не заполненных полей EMAIL, если нет проверить корректность
        const noFillEmail = noValidInputsText.find(input => input?.dataset?.type === 'email');
        const incorrectEmail 
            = !noFillEmail ? this.validation.validationEmail(this.redraw.menedgerEmail.value) : false;
        if(!incorrectEmail) this.redraw.setInvalid(this.redraw.menedgerEmail);
        
        // есть ли среди не заполненных полей PHONE, если нет проверить корректность
        const noFillPhones = noValidInputsText.filter(input => input?.dataset?.type === 'phone');
        let incorrectPhones = []; //не валидные для дальнейшего использования
        this.redraw.phones.forEach(input => {
            let result;
            // если есть есть не заполненные телефоны и данного поля
            // нет в не заполненных проверяем так
            if(noFillPhones && !noFillPhones.includes(input)) {
                result = this.validation.validationPhone(input.value);
            } 

            // если все поля phone заполненны, проверяем так
            if(!noFillPhones) {
                result = this.validation.validationPhone(input.value);
            }

            if(!result) {
                incorrectPhones.push(input); // сохраняем не валидные для дальнейшего использования
                this.redraw.setInvalid(input)
            };
        })

        if((Array.isArray(noValidInputsText) && noValidInputsText.length) ||
        incorrectRadio.length || !isCorrectParsonalData || !incorrectEmail || incorrectPhones.length) {
            return;
        }

        const formData = new FormData(this.redraw.form);

        this.loaderApi.show();

        const responseData = await this.submitApi.create(formData);

        this.loaderApi.hide();

        if(responseData) {
            this.dialogApi.openDialog('success');
        } else {
            this.dialogApi.openDialog('fail');
        };
    }
}