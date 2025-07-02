export default class Redraw {
    constructor(form) {
        this.form = form;
        this.inputs = [...this.form.querySelectorAll('input')];
        this.formMessage = this.form.querySelector('.consultation__send-message');

        // таймауе id для setFormMessage
        this.timeOutIdSM = null;

        // таймауе id для removeInvalidForm, для таймаута который устанавливает стандартное значение false
        // для this.formCheckedInvalid, чтобы пошла проверка полей формы и если все поля валидны, снятие не валидности с формы
        // эта проверка каждый раз при вводе символа нужна потому что, проверяются есть ли не валидные поля еще,
        // кроме переданного в removeInvalidForm, соответственно чтобы при каждом вводе символа не запускать функцию проверки
        // устанавливается тротлинг на ввод, для тротлинга и существует this.timeOutIdRI
        this.timeOutIdRI = null;
        // маркер, проверялись ли уже поля формы на валидность при вводе (событии input)
        // (для removeInvalidForm)
        this.formCheckedInvalid = false;
    }

    /**
     * @description устанавливает невалидность на фоорму, могут прилететь как не заполненные поля так и заполненные
     * @param inputs массив невалидных полей формы 
     * */ 
    setInvalid(inputs) {
        /**
         * устанавливается имееная ошибка если элемент не заполнен, чтобы в дальнейшем если элемент не валиден
         * т.е. или не заполнен или заполнен, но не корректо, показать какой конкретно элемент нужно исправить
         * */ 
        inputs.forEach(item => {
            if(!item.value) item.setCustomValidity(`Поле ${item.dataset.name} обязательно для заполнения`);

            // если пришло заполненное поле, значит это email или phone, некорректно заполнен
            // но на всякий случай ставим проверку (item.name === 'email' || item.name === 'phone')
            if(item.value && (item.name === 'email' || item.name === 'phone')) {
                item.setCustomValidity(`Поле ${item.dataset.name} заполнено неправильно`);
            }
        })

        // Дальше мы выбираем какую ошибку показать именную или общую

        /**
         * @description показываем ошибку пользователю, берем ее или из элемента не прошедшего
         * проверку на корректность заполнения или ставим общую
         * Если 2 или 3 элемента в массиве (параметре) значит есть несколько не заполненных поля показываем общую ошибку, 
         * если это один элемент, значит он или пуст или не корректно заполнен, берем из него ошибку которую установили выше
         * в цикле
         * */ 
        if(inputs.length <= 3 && inputs.length >= 2) this.setFormMessage('Все поля обязательны для заполнения');
        if(inputs.length === 1) this.setFormMessage(inputs[0].validationMessage);
        
        this.form.setAttribute('invalid', '')
    }

    /**
     * @description снимает невалидность с формы (убирает атрибут invalid), применяется при событии input
     * @param input поле на котором срабатывает событие input
     * */ 
    removeInvalidForm(input) {
        // для тротлинга (очищаем таймаут тротлинга который допускает 
        // к проверке, чтобы запустить новый таймаут который 
        // по окончании допускает к проверке, чтоб проверка не происходила при каждом вводе символа в поле)
        if (this.timeOutIdRI) {
            clearTimeout(this.timeOutIdRI);
            this.timeOutIdRI = null;
        }


        // Для того чтобы снять не валидность с формы нужно проверить есть ли еще не валидные поля
        // кроме переданного (оно заполняется, а значит до следующего нажатия submit, может
        // считаться валидным), чтобы не проводить эту проверку при каждом нажатии клавиш,
        // делаем тротлинг для этого таймауты и условия вверху и внизу метода
        if(!this.formCheckedInvalid) {
    
            // переданное поле заполняется, а значит до следующего нажатия submit, может
            // считаться валидным
            input.setCustomValidity('');

            // проверяем есть ли в остальных полях сообщения об ошибке
            // получаем инпуты, исключив переданный
            const restInputs = this.inputs.filter(item => item.name !== input.name);
            // ищем среди отобранных хоть один не валидный
            const validResult = restInputs.some(item => item.validity.customError);
    
            // когда в остальных полях сообщение об ошибке не найдено
            if(!validResult) {
                this.form.removeAttribute('invalid')
                this.removeFormMessage();
            };

            // Ввод данных уже был и поля проверялись
            this.formCheckedInvalid = true;
        }


        // для снятие ограничений на проверку и дальнейшее возможное снятие не валидности (тоже относится к тротлингу)
        this.timeOutIdRI = setTimeout(() => {
            this.formCheckedInvalid = false;
            this.timeOutIdRI = null;
        }, 500);
        
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
        this.formMessage.classList.add('consultation__send-message_active');

        if(isError) this.formMessage.style.color = "#f08686";

        this.timeOutIdSM = setTimeout(() => {
            this.formMessage.textContent = '';
            this.formMessage.classList.remove('consultation__send-message_active');
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
            this.formMessage.classList.remove('consultation__send-message_active');
        }
    }
}