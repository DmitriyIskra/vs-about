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
        const observer = new ResizeObserver(this.redraw.rebuildPage);
        observer.observe(document.body);
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);

        this.redraw.profileEmail.addEventListener('input', this.input);
        this.redraw.questionArea.addEventListener('input', this.input);
        this.redraw.changeOrderTextArea.addEventListener('input', this.input);
        this.redraw.textAreaCollection.forEach(area => area.addEventListener('input', this.input));
    }

    click(e) {
        // e.preventDefault();

        // Переключение контента
        if(e.target.closest('.lkt__cont-switcher')) {
            const target = e.target.closest('.lkt__cont-switcher');
            const param = target.dataset.item;

            this.redraw.switchContent(param); // переключили контент
            
            // Показать активный переключатель (чтоб было понятно какой контент открыт)
            this.redraw.changeSwitcher(target);

            // показываем документы при открытии заказа и стрелку назад в главном заголовке
            if(param === 'order') {
                this.redraw.showAsideDocs()
                this.redraw.showArrowBackMainTitle();
            }
            // Скрываем стрелку назад в главном заголовке при закрытии order
            if(param !== 'order') this.redraw.hideArrowBackMainTitle();

            // скрываем блок документы, но только если переключатель не запрос на изменение или на аннуляцию
            if(
                param === 'journeys'  || 
                param === 'history'   || 
                param === 'favorites' || 
                param === 'question'
            ) this.redraw.hideAsideDocs();
        }

        // Профайл свернуть развернуть
        if(e.target.closest('.lkt__aside-arrow') && innerWidth <= 1024) {
            const target = e.target.closest('.lkt__aside-arrow');
            
            // если на стрелке есть класс active значит aside открыт надо закрыть
            if(target.classList.contains('lkt__aside-arrow_active')) {
                this.redraw.closeAside(target);
                return
            }
            
            // иначе aside закрыт надо открыть
            this.redraw.openAside(target);
        }

        // ORDER
        // Открытие закрытие аккордионов (down opener)
        if(e.target.closest('.lkt__down-opener')) {
            const target = e.target.closest('.lkt__down-opener');
            this.redraw.controllOpener(target);
        }

        // Отправка подтверждение почты 
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

        // Отправка задать вопрос 
        if(e.target.closest('.lkt-question__button')) {
            const formData = new FormData(this.redraw.questionForm);

            if(!formData.get('question').length) {
                this.redraw.setInvalidPlace(this.redraw.questionArea, 'Задайте Ваш вопрос');
                return;
            }


        }

        // При открытии запроса на изменение по заказу, авто заполнение номера
        if(e.target.closest('.lkt-docs__link_change')) this.redraw.fillNumberOrderChange();

        // Отправка запроса на изменение заказа
        if(e.target.closest('.lkt-change__button')) {
            const isTextFromArea = this.redraw.changeOrderTextArea.value.length;
            if(!isTextFromArea) {
                this.redraw.setInvalidPlace(
                    this.redraw.changeOrderTextArea, 'Поле обязательно для заполнения'
                );
            }
        }
    }

    input(e) {
        // email в profile
        if(e.target.matches('.lkt-profile__input')) this.redraw.removeInvalidProfileEmail();

        // Задать вопрос
        if(e.target.matches('.lkt-question__textarea')) {
            this.redraw.removeInvalidPlace(e.target);


        }
        
        // Запрос на изменения по заказу
        if(e.target.matches('.lkt-change__textarea')) {
            this.redraw.removeInvalidPlace(e.target);

            
        }

        // Подсчет символов на счетчике для textarea
        if(e.target.closest('textarea')) {
            const length = e.target.value.length;
            const counter = e.target.nextElementSibling.children[0];
            
            console.log(this.redraw.limitTextArea);
            console.log(length);
            if(length <= this.redraw.limitTextArea) this.redraw.textAreaCounter(counter, length);
            if(length >= this.redraw.limitTextArea) this.redraw.limiterTextArea(e.target, e.target.value);
        }
    }
}