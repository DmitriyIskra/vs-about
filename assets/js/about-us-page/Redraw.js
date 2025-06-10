export default class RedrawAboutUs {
    constructor(form) {
        this.form = form;
        this.formMessage = this.form.querySelector('.subscr-i__send-message');

        // таймауе id для setFormMessage
        this.timeOutIdSM = null;
        // таймауе id для removeInvalidForm
        this.timeOutIdRI = null;
        // маркер, проверялись ли поля формы на валидность при вводе (removeInvalidForm)
        this.formCheckedInvalid = false;
    }

    /**
     * @description устанавливает невалидность на фоорму 
     * @param inputs массив невалидных полей формы 
     * */ 
    setInvalid(inputs) {
        inputs.forEach(item => {
            // заполненное поле может сюда прилететь только если это email

            // если прилетит 2 или 1 не заполненное поле
            if(!item.value) item.setCustomValidity(`Поле ${item.name} обязательно для заполнения`);

            // или прилетит заполненное поле, значит это email, некорректно заполнен
            if(item.value && item.name === 'email') 
                item.setCustomValidity(`Поле ${item.name} заполнено неправильно`);
        })

        /**
         * Если 2 элемента значит оба поля не заполненны, если это один элемент, значит
         * он либо не заполнен, либо это email и он некорректно заполнен, перем сообщение из 
         * поля
         * */ 
        if(inputs.length === 2) this.setFormMessage('Все поля обязательны для заполнения');
        if(inputs.length === 1) this.setFormMessage(inputs[0].validationMessage);
        
        this.form.setAttribute('invalid', '')
    }

    // снимает невалидность с формы (убирает атрибут invalid)
    removeInvalidForm(input) {
        if (this.form.hasAttribute('invalid')) {
            if (this.timeOutIdRI) {
                clearTimeout(this.timeOutIdRI);
                this.timeOutIdRI = null;
            }
    
            // проверка происходит только через тротлинг
            if(!this.formCheckedInvalid) {
                console.log('check');
                let checkOverInput = false;
        
                input.setCustomValidity('');
    
                // проверяем есть ли во втором поле сообщение об ошибке
                if(input.name === 'name') checkOverInput = this.form.email.validity.customError;
                if(input.name === 'email') checkOverInput = this.form.name.validity.customError;
        
                // когда во втором поле сообщение об ошибке не найдено
                if(!checkOverInput) {
                    this.form.removeAttribute('invalid')
                    this.removeFormMessage();
                };
    
                this.formCheckedInvalid = true;
            }
    
            this.timeOutIdRI = setTimeout(() => {
                this.formCheckedInvalid = false;
                this.timeOutIdRI = null;
            }, 500);
        }
    }

    /**
     * @description активирует и показывает переданное сообщение формы
     * @description скрывает через 5 секунд
     * 
     * @param {*} message сообщение которое нужно показать
     * @param {boolean} [isError=false] при отправке формы, если передано true значит нужно поменять
     *  цвет вручную без класса css
     * */ 
    // 
    setFormMessage(message, isError = false) {
        if(this.timeOutIdSM) {
            clearTimeout(this.timeOutIdSM);
            this.timeOutIdSM = null;
        }
        
        this.formMessage.textContent = message;
        this.formMessage.classList.add('subscr-i__send-message_active');

        if(isError) this.formMessage.style.color = "#f08686";

        this.timeOutIdSM = setTimeout(() => {
            this.formMessage.textContent = '';
            this.formMessage.classList.remove('subscr-i__send-message_active');
            this.timeOutIdSM = null;

            if (this.formMessage.hasAttribute('style')) {
                this.formMessage.removeAttribute('style');
                isError = false;
            }
        }, 5000);
    }

    // Закрывает сообщение формы, если оно было открыто
    removeFormMessage() {
        if(this.timeOutIdSM) {
            clearTimeout(this.timeOutIdSM);
            this.timeOutIdSM = null;

            this.formMessage.textContent = '';
            this.formMessage.classList.remove('subscr-i__send-message_active');
        }
    }
}