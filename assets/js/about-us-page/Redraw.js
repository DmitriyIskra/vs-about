export default class RedrawAboutUs {
    constructor(el) {
        this.el = el;
        this.form = this.el.querySelector('form');
        this.formMessage = this.form.querySelector('.about-us__form_send-message');
    }

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
        if(inputs.length === 2) this.setMessage('Все поля обязательны для заполнения');
        if(inputs.length === 1) this.setMessage(inputs[0].validationMessage);
        
        this.form.setAttribute('invalid', '')
    }
    
    removeInvalid() {
        console.log(this.form[item.name].validity.customError)
        console.log(this.form[item.name].validationMessage)
    }

    setMessage(message) {
        this.formMessage.textContent = message;
        this.formMessage.classList.add('about-us__form_send-message_active');

        setTimeout(() => {
            this.formMessage.textContent = '';
            this.formMessage.classList.remove('about-us__form_send-message_active')
        }, 5000);
    }
}