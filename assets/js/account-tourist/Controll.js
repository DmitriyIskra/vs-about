export default class Controll {
    constructor(redraw, validator) {
        this.redraw = redraw;
        this.validator = validator;
        
        this.click = this.click.bind(this);
        this.input = this.input.bind(this);
    }

    init() {
        // регистрация событий
        this.registerEvents();

        // подготовка элементов (размеры, открыт, закрыт) и заполнение элементов данными
        this.redraw.startPage();

        // отслеживает изменения экрана, и вносит изменения в элементы, в зависимости от размера
        const observer = new ResizeObserver(this.redraw.relocationDocs);
        observer.observe(document.body);
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);

        this.redraw.profileEmail.addEventListener('input', this.input);
    }

    click(e) {
        // e.preventDefault();

        // Переключение контента
        if(e.target.closest('.lkt__cont-switcher')) {
            const target = e.target.closest('.lkt__cont-switcher');
            const param = target.dataset.item;

            this.redraw.switchContent(param); // переключили контент

            // скрываем документы, но только если переключатель не запрос на изменение или на аннуляцию
            if(param !== 'change' && param !== 'annulation') this.redraw.hideAsideDocs();

            if(param !== 'order' && param !== 'change' && param !== 'annulation') this.redraw.changeSwitcher(target); // сменили активный переключатель
            
            // показываем документы при открытии заказа
            if(param === 'order') this.redraw.showAsideDocs();
        }


        // ORDER
        // Открытие закрытие аккордионов (down opener)
        if(e.target.closest('.lkt__down-opener')) {
            const target = e.target.closest('.lkt__down-opener');
            this.redraw.controllOpener(target);
        }


        // Подтверждение почты
        if(e.target.closest('.lkt-profile__confirm')) {
            const formData = new FormData(this.redraw.profileEmailForm);
            if(!formData.get('profile_email').length) {
                this.redraw.setInvalidProfileEmail('Поле обязательно для заполнения');
                return;
            };

            if(!this.validator.validationEmail(formData.get('profile_email'))) {
                this.redraw.setInvalidProfileEmail('Некорректо заполенно поле "Ваша почта"');
                return;
            }

            
        }
    }

    input(e) {
        if(e.target.matches('.lkt-profile__input')) {
            this.redraw.removeInvalidProfileEmail();
        }
    }
}