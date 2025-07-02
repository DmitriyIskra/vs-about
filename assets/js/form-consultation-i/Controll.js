export default class Controll {
    constructor(redraw, rest, loaderApi) {
        this.redraw = redraw;
        this.rest = rest;
        this.loaderApi = loaderApi;
        
        this.click = this.click.bind(this);
        this.submit = this.submit.bind(this);
        this.input = this.input.bind(this);
    }

    init() {
        this.registerEvents();

        // управление лоадером
        this.loaderApi.init();
        this.registerPhoneMask(this.redraw.form.phone);
    }

    registerEvents() {
        this.redraw.form.addEventListener('submit', this.submit);
        this.redraw.form.name.addEventListener('input', this.input);
        this.redraw.form.phone.addEventListener('input', this.input);
        this.redraw.form.email.addEventListener('input', this.input);
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
        // if(e.target.closest('')) {


        // }
    }

    async submit(e) {
        e.preventDefault();

        const name = this.redraw.form.name.value;
        const phone = this.redraw.form.phone.value;
        const email = this.redraw.form.email.value;

        if(!name || !email || !phone) {
            // собираем согласно условию не заполненные поля
            const invalidInputs = [];
            if(!name) invalidInputs.push(this.redraw.form.name);
            if(!email) invalidInputs.push(this.redraw.form.email);
            if(!phone) invalidInputs.push(this.redraw.form.phone);

            this.redraw.setInvalid(invalidInputs);
            return;
        }
        
        if(!/\+7 \(\d\d\d\) \d\d\d-\d\d-\d\d/.test(phone)) {
            this.redraw.setInvalid([this.redraw.form.phone]);
            return;
        }

        if(!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.+\.[A-Za-z]{2,4}$/i.test(email)) {
            this.redraw.setInvalid([this.redraw.form.email]);
            return;
        }

        const formData = new FormData(this.redraw.form);

        this.loaderApi.show();

        const resultSendData = await this.rest.create(formData);

        this.loaderApi.hide();

        if(resultSendData) {
            this.redraw.setFormMessage('Подписка успешно оформлена');
            this.redraw.form.reset();
        };
        if(!resultSendData) this.redraw.setFormMessage('Что-то пошло не так, попробуйте еще раз', true);
    }

    input(e) {
        // проверяем есть ли не валидность на форме и нужно ли ее снимать
        // так как метод вызывается при вводе символов каждый раз вне зависимости валидна форма или не валидна
        // (просто текст вводится, значит метод вызывается), и форма валидна
        // нет необходимости выполнять все дальнейшие действия
        if (this.redraw.form.hasAttribute('invalid')) this.redraw.removeInvalidForm(e.target);
    }
}