export default class Controll {
    constructor(draws, validator) {
        this.draws = draws;
        this.validator = validator;

        this.activatedSize = null;
        
        this.click = this.click.bind(this);
        this.input = this.input.bind(this);
        this.rebuildPage = this.rebuildPage.bind(this);
    }

    init() {
        // регистрация событий
        this.registerEvents();

        // подготовка элементов (размеры, открыт, закрыт) и заполнение элементов данными
        this.draws.main.startPage();
        this.draws.aside.startAside();
        this.draws.order.startOrder();

        this.activatedSize = innerWidth > 1024 ? 1025 : 1024;

        // отслеживает изменения экрана, и вносит изменения в элементы, в зависимости от размера
        const observer = new ResizeObserver(this.rebuildPage, { box: 'border-box' });
        observer.observe(document.body);

        // регистрация маски на поля для ввода телефона
        this.registerMasks();
    }

    registerEvents() {
        this.draws.main.el.addEventListener('click', this.click);

        this.draws.aside.profileEmail.addEventListener('input', this.input);
        this.draws.main.questionArea.addEventListener('input', this.input);
        // this.draws.order.changeOrderTextArea.addEventListener('input', this.input);
        this.draws.main.textAreaCollection.forEach(area => area.addEventListener('input', this.input));
    }

    click(e) {
        // Переключение контента
        if(e.target.closest('.lkt__cont-switcher')) {
            const target = e.target.closest('.lkt__cont-switcher');
            const param = target.dataset.item;

            this.draws.main.switchContent(param); // переключили контент
            
            // Показать активный переключатель (чтоб было понятно какой контент открыт)
            this.draws.main.changeSwitcher(target);

            // показываем документы при открытии заказа и стрелку назад в главном заголовке
            if(param === 'order') {
                this.draws.aside.showAsideDocs()
                this.draws.main.showArrowBackMainTitle();
            }
            // Скрываем стрелку назад в главном заголовке при закрытии order
            if(param !== 'order') this.draws.main.hideArrowBackMainTitle();

            // скрываем блок документы, но только если переключатель не запрос на изменение или на аннуляцию
            if(
                param === 'journeys'  || 
                param === 'history'   || 
                param === 'favorites' || 
                param === 'question'
            ) this.draws.aside.hideAsideDocs();
        }

        // НЕТ ОТЧЕСТВА
        if(e.target.closest('.lkt__checkbox-patronimic')) {
            const target = e.target.closest('.lkt__checkbox-patronimic');
            this.draws.main.noPatronimic(target);
        }

        // SELECT Документ выбор - открыть закрыть options выбор документа
        if(e.target.closest('.lkt__label-select')) {
            const target = e.target.closest('.lkt__label-select');
            this.draws.main.controllChoiceDoc(target);
        }
        // Документ выбор - выбор options документа
        if(e.target.closest('.lkt__select-list')) {
            const option = e.target.closest('.lkt__option-item');
            this.draws.main.fillInputDoc(option);
        }

        // RADIO переключение radio кнопок 
        if(e.target.closest('.lkt-order__radio-label')) {
            e.preventDefault();

            const target = e.target.closest('.lkt-order__radio-label');
            this.draws.main.reCheckedRadioButton(target);
        }  

        // START ASIDE
        // Профайл свернуть развернуть
        if(e.target.closest('.lkt__aside-arrow') && innerWidth <= 1024) {
            const target = e.target.closest('.lkt__aside-arrow');
            
            // если на стрелке есть класс active значит aside открыт надо закрыть
            if(target.classList.contains('lkt__aside-arrow_active')) {
                this.draws.aside.closeAside();
                return
            }
            
            // иначе aside закрыт надо открыть
            this.draws.aside.openAside();
        }

        // Отправка подтверждение почты 
        if(e.target.closest('.lkt-profile__confirm')) {
            const formData = new FormData(this.draws.aside.profileEmailForm);
            if(!formData.get('profile_email').length) {
                this.draws.aside.setInvalidProfileEmail('Поле обязательно для заполнения');
                return;
            };

            if(!this.validator.validationEmail(formData.get('profile_email'))) {
                this.draws.aside.setInvalidProfileEmail('Некорректо заполенно поле "Ваша почта"');
                return;
            }

            this.resizeAside();
        }
        // END ASIDE

    
        // START ORDER
        // Открытие закрытие аккордионов (down opener)
        if(e.target.closest('.lkt__down-opener')) {
            const target = e.target.closest('.lkt__down-opener');
            this.draws.order.controllOpener(target);
        }

        // Открыть формы для туристов
        if(e.target.closest('.lkt-order__orderer-submit')) {
            const target = e.target.closest('.lkt-order__orderer-submit');
            this.draws.order.showTouristsForms();
            this.draws.main.disableButton(target); // блокировка кнопки
            // const days = this.draws.order.ordererForm.dataset.type;
            // let reqInputs = null;
            // // отбираем обязательные поля для проверки
            // if(days === 'one') {
            //     reqInputs = [...this.draws.order.ordererForm.firstElementChild
            //         .querySelectorAll('input[required]')];
            // }
            // if(days === 'more') {
            //     reqInputs = [...this.draws.order.ordererForm.querySelectorAll('input[required]')];
            // }

            // // Все ли обязательные поля заполненны
            // let isFillAll = null; 
            // if(reqInputs) {
            //     reqInputs.forEach(input => isFillAll = this.validator.isFilledInputsText(reqInputs));
            // }
            // // перебираем поля которые не были заполненны
            // if(isFillAll.length) isFillAll.forEach(input => {
            //         this.draws.main.setInvalidPlace(input, 'это поле обязательно для заполнения');
            //         input.addEventListener('input', (e) => {
            //             this.draws.main.removeInvalidPlace(e.target);
            //         })
            //     });
            
        }

        // Совпадает с данными Заказчика, авто заполнение
        if(e.target.closest('.lkt-order__radio-label-match')) {
            
        } 

        // ПЕРСОНАЛЬНЫЕ ДАННЫЕ Открыть согласие на использование персональных данных
        if(e.target.closest('.lkt-order__parts-confirm')) {
            const target = e.target.closest('.lkt-order__parts-confirm');
            this.draws.main.disableButton(target); // блокировка кнопки
            this.draws.order.showAgree();
        }
        // принятие и закрытие
        if(e.target.closest('.lkt-order__agree-confirm')) {
            // СОБРАТЬ ЧЕКБОКС И ДАТУ

            const parent = e.target.closest('.lkt-order__agree-wr-confirm');
            const opener = parent.parentElement.previousElementSibling;
            this.draws.order.controllOpener(opener);
        }

        // При открытии запроса на изменение по заказу, авто заполнение номера
        if(e.target.closest('.lkt-docs__link_change')) this.draws.order.fillNumberOrderChange();
        // Отправка запроса на изменение заказа
        if(e.target.closest('.lkt-change__button')) {
            const isTextFromArea = this.draws.order.changeOrderTextArea.value.length;
            if(!isTextFromArea) {
                this.draws.main.setInvalidPlace(
                    this.draws.order.changeOrderTextArea, 'Поле обязательно для заполнения'
                );
            }
        }
        // END ORDER


        // START ЗАДАТЬ ВОПРОС
        // Отправка задать вопрос 
        if(e.target.closest('.lkt-question__button')) {
            const formData = new FormData(this.draws.main.questionForm);

            if(!formData.get('question').length) {
                this.draws.main.setInvalidPlace(this.draws.main.questionArea, 'Задайте Ваш вопрос');
                return;
            }
        }
        // END ЗАДАТЬ ВОПРОС

        

    }

    input(e) {
        // email в profile
        if(e.target.matches('.lkt-profile__input')) this.draws.aside.removeInvalidProfileEmail();

        // Задать вопрос
        if(e.target.matches('.lkt-question__textarea')) {
            this.draws.main.removeInvalidPlace(e.target);


        }
        
        // Запрос на изменения по заказу
        if(e.target.matches('.lkt-change__textarea')) {
            this.draws.main.removeInvalidPlace(e.target);

            
        }

        // Подсчет символов на счетчике для textarea
        if(e.target.closest('textarea')) {
            const length = e.target.value.length;
            const counter = e.target.nextElementSibling.children[0];
            
            if(length <= this.draws.main.limitTextArea) this.draws.main.textAreaCounter(counter, length);
            if(length >= this.draws.main.limitTextArea) this.draws.main.limiterTextArea(e.target, e.target.value);
        }
    }

    // Перестраивает страницу под окно мобильное или нет
    // вызывая соответствующие методы отвечающие за те или иные области страницы
    rebuildPage(e) {
        const widthBody = e[0].contentBoxSize[0].inlineSize;
        
        // тротлинг чтоб каждый раз не срабатывало
        if((this.activatedSize === 1025 && widthBody >= this.activatedSize) ||
        (this.activatedSize === 1024 && widthBody <= this.activatedSize)) {
            return;
        }

        // перемещение блока ДОКУМЕНТЫ
        // перемещаем в мобилку (в заказ в самый низ)
        if(innerWidth <= 1024 && this.draws.aside.asideDocs.closest('.lkt__aside')) {
            const docs = this.draws.aside.cutDocs();
            this.draws.order.pasteDocs(docs);
        } 
        // перемещаем в десктоп (в aside)
        if(innerWidth > 1024 && this.draws.aside.asideDocs.closest('.lkt-order')) {
            this.draws.order.cutDocs();
            this.draws.aside.pasteDocs();
        }

        // ПЕРЕСЧЕТ ОПЕНЕРОВ где формы в заказе
        this.draws.order.activatedOpenners.forEach(item => {
            // Получаем элемент с контентом(блок следующий за блоком со стрелкой)
            const content = item.nextElementSibling;
            this.draws.order.resizeActivatedOpener(content)
        });

        // ПЕРЕРИСОВКА ASIDE при смене версии разрешения экрана
        this.draws.aside.resizeAside();

        this.activatedSize = innerWidth > 1024 ? 1025 : 1024;
    }

    registerMasks() {
        const phones = [...this.draws.order.order.querySelectorAll('input[name="phone"]')];
        const birthdays = [...this.draws.order.order.querySelectorAll('input[name="birthday"]')];
        
        if(IMask) {
            if(phones.length) {
                phones.forEach(phone => {
                    const maskOptions = {
                        mask: '+7 (000) 000-00-00',
                        // lazy: false,
                        // placeholderChar: '0',
                    };
            
                    IMask(phone, maskOptions);
                })
            }

            if(birthdays.length) {
                birthdays.forEach(phone => {
                    const maskOptions = {
                        mask: '00/00/0000',
                        // lazy: true,
                        // placeholderChar: '0',
                    };
            
                    IMask(phone, maskOptions);
                })
            }
        }

    }
}