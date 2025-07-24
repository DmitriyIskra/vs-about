export default class Redraw {
    constructor(aside) {
        this.aside = aside;
        
        this.phoneNumber = null;
        this.email

        // обертка над кнопкой выход и данными профиля, у нее будем менять цвет фона
        this.profileContent = this.aside.querySelector('.lkt-profile__content');
        // Данные профиля, список
        this.profileList = this.aside.querySelector('.lkt-profile__list');

        // Форма подтверждения email в aside профильные данные ("Ваши данные")
        this.profileEmailForm = this.aside.querySelector('.lkt-profile__form');
        this.profileEmail = this.profileEmailForm.profile_email;

        // блок документы в aside
        this.asideDocs = this.aside.querySelector('.lkt-docs');
        this.openerArrow = this.aside.nextElementSibling;

        // ------------------

        // высота открытого aside в мобильной версии
        this.asideHideOpen = null;
    }

    startAside() {
        // Стартовая высота для aside в мобилке для работы опенера
        if(innerWidth <= 1024) {
            this.asideHideOpen = this.aside.offsetHeight / innerWidth * 100;
            this.aside.style.height = `${this.asideHideOpen}vw`;
        }
    }

    resizeAside() {
        // Когда первый вход с десктопной ширины, то this.asideHideOpen, будет не заполненно
        // и при изменении на ширину мобилки сработает это условие и дальше при изменнии ширины
        // будет адаптироваться по этому условию
        // 
        // если первый вход с мобильной ширины, то сработает startAside() и в это условие уже не сработает, 
        // но при изменении ширины на десктоп данные будут очищенны и в дальнейшем 
        // при смене версии будет работать это условие
        if(!this.asideHideOpen && innerWidth <= 1024) {
            setTimeout(() => {
                this.asideHideOpen = this.aside.offsetHeight / innerWidth * 100;
                
                // если при смене версии экрана с мобилки на десктоп aside было закрыто, 
                //  то по возвращению его закроет и наоборот
                if(!this.openerArrow.classList.contains('lkt__aside-arrow_active')) {
                    this.closeAside(false);
                } else {
                    this.openAside(false);
                }
            })
        }

        if(innerWidth > 1024) {
            this.aside.style.height = ``;
            this.asideHideOpen = null;
            this.profileContent.style.backgroundColor = '#F2F2F2';
            this.aside.style.transition = '';
        }

    }

    // Развернуть aside, для мобилки
    openAside(animated = true) {;
        if(animated) {
            this.aside.style.transition = 'height 0.2s linear';

            this.aside.addEventListener('transitionend', (e) => {
                this.openerArrow.classList.toggle('lkt__aside-arrow_active');
            }, {once: true})
        }

        this.profileContent.style.backgroundColor = '#F2F2F2';
        this.aside.style.height = `${this.asideHideOpen}vw`;
    }
    // Свернуть aside, для мобилки
    closeAside(animated = true) {
        if(animated) {
            this.aside.style.transition = 'height 0.2s linear';

            this.aside.addEventListener('transitionend', (e) => {
                this.openerArrow.classList.toggle('lkt__aside-arrow_active');
            }, {once: true})
        }

        // Список элементов высоты которых нужно сложить
        const arrCalcElements = [
            this.aside.children[0],
            this.profileList.children[0],
            this.profileList.children[1],
            this.profileList.children[2],
        ];

        const closeHide = arrCalcElements.reduce((acc, el) => acc += el.offsetHeight, 0);

        this.profileContent.style.backgroundColor = 'transparent';
        this.aside.style.height = `${closeHide / innerWidth * 100}vw`;
    }

    // Установка не валидности на поле email в profile
    setInvalidProfileEmail(message) {
        const parrent = this.profileEmailForm.closest('li');
        parrent.classList.add('lkt-profile__not-confirmed_error');
        this.profileEmail.setCustomValidity(message);
        this.profileEmail.reportValidity();
    }

    // Снятие не валидности на поле email в profile
    removeInvalidProfileEmail() {
        if(!this.profileEmail.checkValidity()) {
            const parrent = this.profileEmailForm.closest('li');
            parrent.classList.remove('lkt-profile__not-confirmed_error');
            this.profileEmail.setCustomValidity('');
        }
    }

    // Показать блок документы
    showAsideDocs() {
        if(!this.asideDocs.classList.contains('lkt-docs__active')) {
            this.asideDocs.classList.add('lkt-docs__active');
        }
        
    }
    // Скрыть блок документы
    hideAsideDocs() {
        if(this.asideDocs.classList.contains('lkt-docs__active')) {
            this.asideDocs.classList.remove('lkt-docs__active');
        }
    }

    // перемещение блока документы 
    pasteDocs() {
        this.aside.append(this.asideDocs);
    }
    cutDocs() {
        const docsToRemove = this.asideDocs;
        docsToRemove.remove();
        return this.asideDocs;
    }
}