export default class Redraw {
    constructor(el) {
        this.el = el;
        
        this.mainTitle = this.el.querySelector('.lkt__wr-main-title');
        // Стрелка назад в главном заголовке (появляется только для order)
        this.arrowBackMainTitle = this.mainTitle.querySelector('.lkt__main-title-back');

        // табы "путешествия, история, избранное"
        this.tabsList = this.el.querySelector('.lkt__header-list');
        
        // контентная часть, область внутри которой отображается и меняется контент
        this.contentWrapper = this.el.querySelector('.lkt-main__content'); 

        // форма и поле задать вопрос
        this.questionForm = this.el.querySelector('.lkt-question__form');
        this.questionArea = this.questionForm.question;

        // Все textarea на странице
        this.textAreaCollection = [...this.el.querySelectorAll('textarea')];

        // -----------------------------

        // активный контент
        this.currentActiveContent = this.contentWrapper.children[0];        
        // активный элемент переключатель контента  
        this.currentActiveSwitcher = null;

        // ширина скрола браузера (для добавления padding того же размера)
        this.widthDefaultScroll = null;

        // ограничение по количеству символов для textArea
        this.limitTextArea = +this.textAreaCollection[0].maxLength;
        
    }

    // Первая загрузка страницы
    startPage() {
        this.currentActiveSwitcher = [this.el.querySelector('.lkt__cont-switcher_active')];
        
        this.stableCenterAccountPage();
    }


    


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

    // Показ и скрытие главного заголовка (для изменения и аннуляции заказа)
    hideMainTitle() {
        this.mainTitle.classList.add('lkt__wr-main-title_hide-m');
    }
    showMainTitle() {
        if(this.mainTitle.classList.contains('lkt__wr-main-title_hide-m')) {
            this.mainTitle.classList.remove('lkt__wr-main-title_hide-m');
        }
    }
    // Показ и скрытие табов "путешествия, история, избранное" (для изменения и аннуляции заказа)
    hideTabsList() {
        this.tabsList.classList.add('lkt__header-list_hide-m');
    }
    showTabsList() {
        if(this.tabsList.classList.contains('lkt__header-list_hide-m')) {
            this.tabsList.classList.remove('lkt__header-list_hide-m');
        }
    }


    // AGREEMENT FOR PAY
    switchAgreementForPay(target) {
        const stateItem = target.closest('.lkt__journeys-state-item'); 
        const buttonPay = stateItem.querySelector('.lkt__button-pay');
        console.log(stateItem);
        console.log(buttonPay);
        const box = target.firstElementChild;
        console.log(box.checked);
        if(!box.checked) {
            console.log('not checked');
            box.checked = true;
            this.unDisableButton(buttonPay);
        } else {
            console.log('checked');
            box.checked = false;
            this.disableButton(buttonPay);
        }
    }


    // Блокировка кнопки
    disableButton(button) {
        button.classList.add('lkt__button_disabled');
    }
    // Разблокировка кнопки
    unDisableButton(button) {
        button.classList.remove('lkt__button_disabled');
    }

    // Установка не валидности 
    setInvalidPlace(element, textError) {
        const label = element.closest('label');
        label.classList.add('lkt__place-invalid');
        element.setCustomValidity(textError);
        element.reportValidity();
    }
    // Снятие не валидности 
    removeInvalidPlace(element) {
        if(!element.checkValidity()) {
            const label = element.closest('label');
            label.classList.remove('lkt__place-invalid');
            element.setCustomValidity('');
        }
    }


    // Нет отчества
    noPatronimic(target) {
        const boxState = target.firstElementChild.checked;
        const input = target.previousElementSibling.lastElementChild;

        if(boxState) {
            input.value = 'Нетотчества';
            input.readOnly = true;
            return;
        }

        input.value = '';
        input.readOnly = false;
    }


    // выбор документа и открытие селекта для выбора
    controllChoiceDoc(target) {
        const options = target.nextElementSibling;
        options.classList.toggle('lkt__select-list_active');
    }
    fillInputDoc(option) {
        const value = option.textContent;
        const select = option.parentElement.previousElementSibling;
        const textSelect = select.lastElementChild;
        const input = select.previousElementSibling;

        textSelect.textContent = value;
        input.value = value;
        select.click();
    }

    // Переключение радио кнопок
    reCheckedRadioButton(targetLabel) {
        // родитель всех Label
        const parentOfLabels = targetLabel.parentElement;
        const allRadio = [...parentOfLabels.querySelectorAll('input[type="radio"]')];
        const targetRadio = targetLabel.querySelector('input[type="radio"]');

        allRadio.forEach(item => item.checked ? item.checked = false : '');
        targetRadio.checked = true;
    }

    
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

    /**
     * @description Создает HTML элемент
     * @param {HTMLElement} el
     * @param {null | Array} classNames
     * @param {null | String} content
     * @returns {HTMLElement}   
     * */ 
    createEl(el, classNames = null, content = null) {
        const element = document.createElement(el);

        if(classNames) classNames.forEach(c => element.classList.add(c));
        if(content) element.textContent = content;
        
        return element;
    }
}