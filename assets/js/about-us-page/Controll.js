export default class ControllAboutUs {
    constructor(redraw, rest) {
        this.redraw = redraw;
        this.rest = rest;
        
        this.click = this.click.bind(this);
        this.submit = this.submit.bind(this);
        this.input = this.input.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
        this.redraw.form.addEventListener('submit', this.submit);
        this.redraw.form.name.addEventListener('input', this.input);
        this.redraw.form.email.addEventListener('input', this.input);
    }

    click(e) {
        // if(e.target.closest('')) {


        // }
    }

    async submit(e) {
        e.preventDefault();

        const name = this.redraw.form.name.value;
        const email = this.redraw.form.email.value;

        if(!name || !email) {
            const invalidInputs = [];
            if(!name) invalidInputs.push(this.redraw.form.name);
            if(!email) invalidInputs.push(this.redraw.form.email);

            this.redraw.setInvalid(invalidInputs);
            return;
        }
        
        if(!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.+\.[A-Za-z]{2,4}$/i.test(email)) {    
            this.redraw.setInvalid([this.redraw.form.email]);
            return;
        }

        const formData = new FormData(this.redraw.form);

        const resultSendData = await this.rest.create(formData);

        if(resultSendData) this.redraw.setFormMessage('Подписка успешно оформлена');
        if(!resultSendData) this.redraw.setFormMessage('Что-то пошло не так, попробуйте еще раз', true);
    }

    input(e) {
        this.redraw.removeInvalidForm(e.target);
    }
}