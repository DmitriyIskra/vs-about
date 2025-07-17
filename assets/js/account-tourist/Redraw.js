export default class Redraw {
    constructor(el) {
        this.el = el;
        
        // Стрелка назад в главном заголовке (появляется только для order)
        this.arrowBackMainTitle = this.el.querySelector('.lkt__main-title-back');

        this.aside = this.el.querySelector('.lkt__aside'); // aside
        
        // Форма подтверждения email в aside профильные данные ("Ваши данные")
        this.profileEmailForm = this.el.querySelector('.lkt-profile__form');
        this.profileEmail = this.profileEmailForm.profile_email;

        // блок документы в aside
        this.asideDocs = this.el.querySelector('.lkt-docs'); 
        
        // область внутри которой отображается и меняется контент
        this.contentWrapper = this.el.querySelector('.lkt-main__content'); 

        // контентная часть: заказ (order)
        this.order = this.el.querySelector('.lkt-order'); 
        // номер открытого заказа
        this.orderNum = this.order.querySelector('.lkt-order__data-number'); 
        // Форма и элементы на зменение заказа
        this.changeOrderForm = this.el.querySelector('.lkt-change__form');
        this.changeOrderTextArea = this.changeOrderForm.change_order_text;

        // форма и поле задать вопрос
        this.questionForm = this.el.querySelector('.lkt-question__form');
        this.questionArea = this.questionForm.question;

        // Все textarea на странице
        this.textAreaCollection = [...this.el.querySelectorAll('textarea')];


        // -----------------------------

        // активный контент
        this.currentActiveContent = this.contentWrapper.children[0];        
        // активный элемент переключатель контента
        // this.currentActiveSwitcher = this.el.querySelector('.lkt__header-list').children[0];    
        this.currentActiveSwitcher = null;    

        // активные (открытые аккордионы)
        this.activeOpenners = [];

        // ширина скрола браузера (для добавления padding того же размера)
        this.widthDefaultScroll = null;

        // ограничение по количеству символов для textArea
        this.limitTextArea = +this.textAreaCollection[0].maxLength;
        // --------------------------------

        this.relocationDocs = this.relocationDocs.bind(this);
    }

    // Первая загрузка страницы
    startPage() {
        this.currentActiveSwitcher = [this.el.querySelector('.lkt__cont-switcher_active')];
        
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
    
    


    // START CHANGE CONTENT
    // Переключение контента
    switchContent(param) {
        this.contentWrapper.dataset.content = param;

        this.stableCenterAccountPage();
    }
    // Подсветка активного элемента переключателя, соответствующего контенту 
    changeSwitcher(el) {
        const param = el.dataset.item;
        // Единственная стрелка по клику по которой нужно исключить смену переключателя
        // есть только в заказе, и возвращает она на journeys, а он уже активен, значит по ней не нужно 
        // активировать переключатель и тем более добавлять ее в массив активных переключателей пере
        if(!el.classList.contains('lkt__head-arrow-back')) {
            if(param !== 'order' && param !== 'change' && param !== 'annulation') {
                console.log('not order');
                this.currentActiveSwitcher = this.currentActiveSwitcher.filter(s => {
                    s.classList.remove('lkt__cont-switcher_active');
                    return s.classList.contains('lkt__cont-switcher_active');
                });

                this.currentActiveSwitcher.push(el);

                this.currentActiveSwitcher.forEach(s => s.classList.add('lkt__cont-switcher_active'));
            }
        }

        // если клик произошел из документов значит мы находимся в заказе и открываем
        // запрос на изменение или на аннуляцию, значит мои путешествия уже активно
        // и его трогать не надо, надо добавить в активные переключатели элемент по которому 
        // произошел клик из документов
        if(param === 'order' || param === 'change' || param === 'annulation') {
            console.log('for order');
            // на случай если клик по элементу из документов уже был, нужно его обнаружить и деактивировать
            this.currentActiveSwitcher = this.currentActiveSwitcher
                .filter(s => {
                    if(s.dataset.item === 'change' || s.dataset.item === 'annulation') {
                        s.classList.remove('lkt__cont-switcher_active')
                    };

                    // т.е. должен вернуться только journeys
                    return s.classList.contains('lkt__cont-switcher_active');
                });

            // Добавляем в массив переключателей только если клик был не по стрелке
            // и если клик был по стрелке, а значит открылся order, потому что к данной стрелке 
            // есть доступ только через order , то очистив все остальное остался только переключатель journey
            // а у него уже есть класс активатор, добавлять еще раз не надо
            if(!el.classList.contains('lkt__head-arrow-back')) {
                this.currentActiveSwitcher.push(el);
    
                this.currentActiveSwitcher
                    .forEach(switcher => switcher.classList.add('lkt__cont-switcher_active'));
            }
        }
    }
    // Показ стрелки назад в главном заголовке при открытии order
    showArrowBackMainTitle() {
        this.arrowBackMainTitle.classList.add('lkt__main-title-back_active');
    }
    // Скрытие стрелки назад в главном заголовке при закрытии order
    hideArrowBackMainTitle() {
        this.arrowBackMainTitle.classList.remove('lkt__main-title-back_active');
    }
    // END CHANGE CONTENT


    // START PROFILE ВАЛИДНОСТЬ - НЕ ВАЛИДНОСТЬ
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
    // END PROFILE ВАЛИДНОСТЬ - НЕ ВАЛИДНОСТЬ
    


    // START SET REMOVE INVALID ЭЛЕМЕНТЫ ФОРМ
    // Установка не валидности на поле email в profile
    setInvalidPlace(element, textError) {
        const label = element.closest('label');
        label.classList.add('lkt__place-invalid');
        element.setCustomValidity(textError);
        element.reportValidity();
    }

    // Снятие не валидности на поле email в profile
    removeInvalidPlace(element) {
        if(!element.checkValidity()) {
            const label = element.closest('label');
            label.classList.remove('lkt__place-invalid');
            element.setCustomValidity('');
        }
    }
    // START SET REMOVE INVALID ЭЛЕМЕНТЫ ФОРМ


    // START ЗАПРОС НА ИЗМЕНЕНИЯ ПО ЗАКАЗУ
    // авто заполнение номера заказа
    fillNumberOrderChange() {
        this.changeOrderForm.number_order.value = this.orderNum.dataset.order_num;
    }
    // END ЗАПРОС НА ИЗМЕНЕНИЯ ПО ЗАКАЗУ


    // START DOCS
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

    // START ALL TEXTAREA
    // Счетчик для textArea
    textAreaCounter(el, value) {
        if(!el instanceof HTMLElement && typeof value !== 'number') return;
        el.textContent = value;
    }
    // Ограничение по количеству символов
    limiterTextArea(target, value) {
        value = value.split('');
        value.length = this.limitTextArea;
        value = value.join('');

        target.value = value;
    }
    // END ALL TEXTAREA

    // установка отступа справа на случай если нет полосы прокрутки
    // для того чтобы при переключении на более длинный контент
    // не происходила движения вправо, при появлении прокрутки
    stableCenterAccountPage() {
        // ширину прокрутки определяем один раз при загрузке страницы
        const heightAccount = this.el.offsetHeight;
        if(!this.widthDefaultScroll) {
            document.body.style.overflowY = 'scroll';
            this.widthDefaultScroll = innerWidth - document.body.offsetWidth;
            document.body.style.overflowY = '';
        } 

        if(innerWidth > 1024 && heightAccount < innerHeight) {
            this.el.style.paddingRight = `${this.widthDefaultScroll}px`;
        }
        if(innerWidth > 1024 && heightAccount >= innerHeight) {
            this.el.style.paddingRight = '';
        }
    }
}