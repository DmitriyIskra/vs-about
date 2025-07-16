export default class Redraw {
    constructor(el) {
        this.el = el;
        
        this.aside = this.el.querySelector('.lkt__aside'); // aside
        // Форма подтверждения email в aside профильные данные ("Ваши данные")
        this.profileEmailForm = this.el.querySelector('.lkt-profile__form');
        this.profileEmail = this.profileEmailForm.profile_email;
        this.asideDocs = this.el.querySelector('.lkt-docs'); // блок документы в aside
        
        // область внутри которой отображается и меняется контент
        this.contentWrapper = this.el.querySelector('.lkt-main__content'); 

        this.order = this.el.querySelector('.lkt-order'); // контентная часть: заказ (order)

        // активный контент
        this.currentActiveContent = this.contentWrapper.children[0];        
        // активный элемент переключатель контента
        this.currentActiveSwitcher = this.el.querySelector('.lkt__header-list').children[0];    
        
        // активные (открытые аккордионы)
        this.activeOpenners = [];

        this.relocationDocs = this.relocationDocs.bind(this);
    }

    // Первая загрузка страницы
    startPage() {
        // down openers которые должны быть активны со старта 
        const arrActivatedOpeners = [
            this.el.querySelector('.lkt-order__data-opener'),
        ];
        arrActivatedOpeners.forEach(opener => {
            this.controllOpener(opener); // активируем
        });

        this.stableCenterAccountPage();
    }


    // пересчет опенеров (хранятся здесь this.activeOpenners = [];) и др
    reCalcDinamicElements() {
    }
    
    // перемещение документов !!! когда будет готов переместить в блок DOCS
    relocationDocs() {
        // перемещаем в мобилку (в заказ в самый низ)
        if(innerWidth <= 1024 && this.asideDocs.closest('.lkt__aside')) {
            this.order.append(this.asideDocs);
        } 
        
        // перемещаем в десктоп (в aside)
        if(innerWidth > 1024 && this.asideDocs.closest('.lkt-order')) {
            this.aside.append(this.asideDocs);
        }
    }

    // START PROFILE
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
    // END PROFILE


    // START CHANGE CONTENT
    // Переключение контента
    switchContent(param) {
        this.contentWrapper.dataset.content = param;

        this.stableCenterAccountPage();
    }
    // Подсветка активного элемента переключателя, соответствующего контенту 
    changeSwitcher(el) {
        this.currentActiveSwitcher.classList.remove('lkt__cont-switcher_active');
        el.classList.add('lkt__cont-switcher_active');
        this.currentActiveSwitcher = el;
    }
    // END CHANGE CONTENT


    // START DOCS
    // Показать блок документы
    showAsideDocs() {
        this.asideDocs.classList.add('lkt-docs__active');
    }
    // Скрыть блок документы
    hideAsideDocs() {
        if(this.asideDocs.classList.contains('lkt-docs__active')) {
            this.asideDocs.classList.remove('lkt-docs__active');
        }
    }
    // END DOCS


    // START DOWN OPENER
    // управление аккордеоном (открывание и скрытае контента c разворачиванием) down opener
    controllOpener(el) {
        el.classList.toggle('lkt__down-opener_active');
        const openerContent = el.nextElementSibling;

        if(el.classList.contains('lkt__down-opener_active')) {
            this.resizeOpener(openerContent);
            this.activeOpenners.push(el); // сохраняем экземпляр, для пересчета размеров в дальнейшем
            return;
        }

        this.activeOpenners = this.activeOpenners.filter(item => item !== el);

        openerContent.style.height = 0;
    }
    // пересчет размеров и перестановка единиц измерения (px - vw)
    resizeOpener(content) {
        let totalContentHeight = [...content.children].reduce((acc, item) => {
            return acc += item.offsetHeight;
        }, 0);

        // перевод во viewport
        if(innerWidth <= 1024) totalContentHeight = totalContentHeight / innerWidth * 100;

        content.style.height = `${totalContentHeight}${innerWidth <= 1024 ? 'vw' : 'px'}`;
    }
    // END DOWN OPENER

    // установка отступа справа на случай если нет полосы прокрутки
    // для того чтобы при переключении на более длинный контент
    // не происходила движения вправо, при появлении прокрутки
    stableCenterAccountPage() {
        const heightAccount = this.el.offsetHeight;
        document.body.style.overflowY = 'scroll';
        const widthScroll = innerWidth - document.body.offsetWidth;
        document.body.style.overflowY = '';

        if(innerWidth > 1024 && heightAccount < innerHeight) {
            this.el.style.paddingRight = `${widthScroll}px`;
        }
        if(innerWidth > 1024 && heightAccount >= innerHeight) {
            this.el.style.paddingRight = '0';
        }
    }
}