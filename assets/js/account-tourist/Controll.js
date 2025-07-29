export default class Controll {
    constructor(draws, reqApi, validator, loader) {
        this.draws = draws;
        this.reqApi = reqApi;
        this.validator = validator;
        this.loader = loader;

        this.activatedSize = null;
        
        this.click = this.click.bind(this);
        this.input = this.input.bind(this);
        this.change = this.change.bind(this);
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

        // перемещение блока ДОКУМЕНТЫ
        // перемещаем в мобилку (в заказ в самый низ)
        if(innerWidth <= 1024 && this.draws.aside.asideDocs.closest('.lkt__aside')) {
            const docs = this.draws.aside.cutDocs();
            this.draws.order.pasteDocs(docs);
        } 

        // регистрация маски на поля для ввода телефона
        this.registerMasks();

        // Инициализируем Loader
        this.loader.init();
    }

    registerEvents() {
        this.draws.main.el.addEventListener('click', this.click);

        this.draws.aside.profileEmail.addEventListener('input', this.input);
        this.draws.main.questionArea.addEventListener('input', this.input);
        this.draws.order.isAgree.addEventListener('change', this.change);
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

            // Скрываем главный заголовок, шапку с профайлом (aside), стрелку сворачивающую и разворачивающую
            // aside в мобилке и табы "путешествия, история, избранное" при 
            // нажатии на запрос на аннуляцию или изменение заказа
            // работает только в мобилке через классы lkt__wr-main-title_hide-m lkt__aside_hide-m
            // lkt__aside-arrow_aside-m и lkt__header-list_hide-m
            if(param === 'change' || param === 'annulation') {
                this.draws.aside.hideAside();
                this.draws.aside.hideOpenerAsideArrow();
                this.draws.main.hideMainTitle();
                this.draws.main.hideTabsList();
            } else {
                this.draws.aside.showAside();
                this.draws.aside.showOpenerAsideArrow();
                this.draws.main.showMainTitle();
                this.draws.main.showTabsList();
            }

            // скрываем блок документы, но только если переключатель не запрос на изменение или на аннуляцию
            if(
                param === 'journeys'  || 
                param === 'history'   || 
                param === 'favorites' || 
                param === 'question'
            ) this.draws.aside.hideAsideDocs();
        }

        // ОПЛАТИТЬ
        // Подтверждаю ознакомление и согласие "checkbox" возле кнопки оплатить
        if(e.target.closest('.lkt__journeys-label-confirm')) {
                e.preventDefault();
                const target = e.target.closest('.lkt__journeys-label-confirm');
                this.draws.main.switchAgreementForPay(target);
        }
        // Оплатить, нажатие на кнопку
        if(e.target.closest('.lkt__button-pay')) {
            const target = e.target.closest('.lkt__button-pay');

            const stateItem = target.closest('.lkt__journeys-state-item'); 
            const box = stateItem.querySelector('input[name="confirm-agreement"]');

            if(!box.checked) return;

            // ДОБАВИТЬ ОБРАБОТКУ ОПЛАТИТЬ ПЕРЕАДРЕСАЦИЯ ИЛИ ЧТО ЭТО БУДЕТ
            console.log('pay');
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

            this.loader.show();
            (async () => {
                const resSend = await this.reqApi.createEmail(formData);
                
                if(resSend) {
                    this.loader.hide();

                    // TO DO
                } else {
                    // TO DO
                }
            })()
            // КАКАЯ РЕАКЦИЯ??????
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
            const resultValidation = this.validationOrderer();
            if(!resultValidation) return;

            const target = e.target.closest('.lkt-order__orderer-submit');
            this.draws.order.showTouristsForms();
            this.draws.main.disableButton(target); // блокировка кнопки
            
        }

        // Совпадает с данными Заказчика checkbox, авто заполнение
        if(e.target.closest('.lkt-order__radio-label-match')) {
            e.preventDefault();
            const label = e.target.closest('.lkt-order__radio-label-match');
            const target = label.querySelector('input');

            const data = Object.fromEntries(new FormData(this.draws.order.ordererForm));
            if(this.draws.aside.profilePhoneData) data.phone = this.draws.aside.profilePhoneData;
            if(this.draws.aside.profileEmailData) data.email = this.draws.aside.profileEmailData;

            this.draws.order.touristIsOrder(target, data);
        } 

        // Открыть согласие на использование персональных данных
        if(e.target.closest('.lkt-order__parts-confirm')) {
            // валидация формы заказчика и туристов
            const validatedOrderer = this.validationOrderer();
            const validationResult = this.validationTourists();
            if(!validatedOrderer || !validationResult) return;
   
            // Получаем кнопку "Подтвердить"
            const target = e.target.closest('.lkt-order__parts-confirm');
            this.draws.main.disableButton(target); // блокировка кнопки
            
            // парсим данные туристов и заказчика в массив объектов
            const ordererData = Object.fromEntries(new FormData (this.draws.order.ordererForm));
            if(this.draws.aside.profilePhoneData) ordererData.phone = this.draws.aside.profilePhoneData;
            if(this.draws.aside.profileEmailData) ordererData.email = this.draws.aside.profileEmailData;
            const touristsData = this.parseTourists();
            
            // Заполняем пользовательское соглашение
            // Формируем строку про заказчика 
            let stringOrderer = `${ordererData.secondname} ${ordererData.name} ${ordererData.patronimic}, `;
            stringOrderer += `${ordererData.phone}, ${ordererData.email}, ${ordererData.сitizenship}, `;
            stringOrderer += `${ordererData.document}, ${ordererData.number_doc}, `;
            stringOrderer += `${ordererData.reg_address}`;

            const touristsElements = [];
            touristsData.forEach(room => {
                room.tourists.forEach(tourist => {
                    let stringTourist = `${tourist.data.secondname} ${tourist.data.name} `;
                    stringTourist += `${tourist.data.patronimic}, ${tourist.data.phone}, `;
                    stringTourist += `${tourist.data.email}, ${tourist.data.сitizenship}, `;
                    stringTourist += `${tourist.data.gender}, ${tourist.data.document}, `;
                    stringTourist += `${tourist.data.number_doc}, ${tourist.data.reg_address}`;

                    touristsElements.push(this.draws.main
                        .createEl(
                            'p', ['lkt-order__agree-text', 'lkt-order__agree-text_bold'], stringTourist
                        ));
                })
            })

            this.draws.order.fillAgree(stringOrderer, touristsElements);
            
            this.draws.order.showAgree();

        }
        // принятие и закрытие блока согласия на использование персональных данных
        // происходит по событию change который описан ниже

        // Отправка данных по заказу
        if(e.target.closest('.lkt-order__submit')) {
            // валидация формы заказчика и туристов
            const validatedOrderer = this.validationOrderer();
            const validationResult = this.validationTourists();
            if(!validatedOrderer || !validationResult) return;

            // парсим данные туристов и заказчика в массив объектов
            const ordererData = Object.fromEntries(new FormData (this.draws.order.ordererForm));
            if(this.draws.aside.profilePhoneData) ordererData.phone = this.draws.aside.profilePhoneData;
            if(this.draws.aside.profileEmailData) ordererData.email = this.draws.aside.profileEmailData;
            const touristsData = this.parseTourists();
            const agree = this.draws.order.isAgree.checked;
            const agreeDate = this.draws.order.agreeData.textContent;

            const data = {
                orderer: ordererData,
                tourists: touristsData,
                agreeData: {agree, agreeDate},
            }

            this.loader.show();
            (async () => {
                const resSend = await this.reqApi.createOrderData(data);
                
                if(resSend) {
                    this.loader.hide();

                    // TO DO
                } else {
                    // TO DO
                }
            })();
        }

        // Запрос на изменение
        // При открытии запроса на изменение по заказу, авто заполнение номера
        if(e.target.closest('.lkt-docs__link_change')) this.draws.order.fillNumberOrderChange();
        // Отправка запроса на изменение заказа
        if(e.target.closest('.lkt-change__button')) {
            const formData = new FormData(this.draws.order.changeOrderForm);
            if(!formData.get('number_order') || !formData.get('change_order_text')) {
                this.draws.main.setInvalidPlace(
                    this.draws.order.changeOrderTextArea, 'Поле обязательно для заполнения'
                );

                return;
            }

            this.loader.show();
            (async () => {
                const resSend = await this.reqApi.createQuestion(formData);
                
                if(resSend) {
                    this.loader.hide();

                    // TO DO
                } else {
                    // TO DO
                }
            })()
        }

        // Запрос на аннуляцию
        // При открытии запроса на изменение по заказу, авто заполнение номера
        if(e.target.closest('.lkt-docs__link_cancel')) this.draws.order.fillNumberOrderAnnulation();
        // Отправка запроса на аннуляцию
        if(e.target.closest('.lkt-annulation__button')) {
            const formData = new FormData(this.draws.order.annulationForm);
            if(!formData.get('number_order') || !formData.get('annulation_text')) {
                this.draws.main.setInvalidPlace(
                    this.draws.order.annulationTextArea, 'Поле обязательно для заполнения'
                );

                return;
            }

            this.loader.show();
            (async () => {
                const resSend = await this.reqApi.createQuestion(formData);
                
                if(resSend) {
                    this.loader.hide();

                    // TO DO
                } else {
                    // TO DO
                }
            })()
        };

        // END ORDER


        // START ЗАДАТЬ ВОПРОС
        // Отправка задать вопрос 
        if(e.target.closest('.lkt-question__button')) {
            const formData = new FormData(this.draws.main.questionForm);

            if(!formData.get('question').length) {
                this.draws.main.setInvalidPlace(this.draws.main.questionArea, 'Задайте Ваш вопрос');
                return;
            }

            this.loader.show();
            (async () => {
                const resSend = await this.reqApi.createQuestion(formData);
                
                if(resSend) {
                    this.loader.hide();

                    // TO DO
                } else {
                    // TO DO
                }
            })()
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

        // Запрос на аннуляцию
        if(e.target.matches('.lkt-annulation__textarea')) {
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

    change(e) {
        // принятие и закрытие согласие на использование персональных данных
        if(e.target.matches('.lkt-order__agree-box')) {
            // если согласие снято блокируем кнопку обратно и не закрываем
            if(!e.target.checked) {
                this.draws.main.disableButton(this.draws.order.submit);
                return;
            };

            // закрываем
            const opener = e.target.nextElementSibling;
            this.draws.order.controllOpener(opener);

            // Разблокируем кнопку "Передать данные"
            this.draws.main.unDisableButton(this.draws.order.submit);
        }
    }

    // валидация заказчика
    validationOrderer() {
        const days = this.draws.order.ordererForm.dataset.type;
        let reqInputs = null;
        // отбираем обязательные поля для проверки
        if(days === 'one') {
            reqInputs = [...this.draws.order.ordererForm.firstElementChild
                .querySelectorAll('input[required]')];
            }
            if(days === 'more') {
            reqInputs = [...this.draws.order.ordererForm.querySelectorAll('input[required]')];
        }

        // Все ли обязательные поля заполненны
        let noFillInputs = null; 
        if(reqInputs) {
            noFillInputs = this.validator.isFilledInputsText(reqInputs);
        }
        // перебираем поля которые не были заполненны и ставим не валидность
        if(noFillInputs.length) {
            noFillInputs.forEach(input => {
                this.draws.main.setInvalidPlace(
                    input, 'Все поля отмеченные звездочкой обязательны для заполнения'
                );

                input.addEventListener('input', (e) => {
                    this.draws.main.removeInvalidPlace(e.target);
                })
            });

            return false;
        }

        return true;
    }

    // валидация туристов
    validationTourists() {
        const reqInputs = [...this.draws.order.tourists.querySelectorAll('input[type=text][required]')];

        // проверяем заполенны ли поля
        let noFillInputs;
        if(reqInputs.length) noFillInputs = this.validator.isFilledInputsText(reqInputs);
        // перебираем поля которые не были заполненны и ставим не валидность
        if(noFillInputs.length) {
            noFillInputs.forEach(input => {
                this.draws.main.setInvalidPlace(
                    input, 'Все поля отмеченные звездочкой обязательны для заполнения'
                );

                input.addEventListener('input', (e) => {
                    this.draws.main.removeInvalidPlace(e.target);
                })
            });

            return;
        }

        // валидация email
        const emailInputs = [...this.draws.order.tourists.querySelectorAll('input[type=text][name=email]')];
        const noValidEmails = emailInputs.filter(email => !this.validator.validationEmail(email.value));
        if(noValidEmails.length) {
            noValidEmails.forEach(input => {
                this.draws.main.setInvalidPlace(
                    input, 'Поле заполненно некорректно'
                );

                input.addEventListener('input', (e) => {
                    this.draws.main.removeInvalidPlace(e.target);
                })
            });
        }

        // валидация телефона
        const phoneInputs = [...this.draws.order.tourists.querySelectorAll('input[type=text][name=email]')];
        const noValidPhones = phoneInputs.filter(phone => !this.validator.validationEmail(phone.value));
        if(noValidPhones.length) {
            noValidPhones.forEach(input => {
                this.draws.main.setInvalidPlace(
                    input, 'Поле заполненно некорректно'
                );

                input.addEventListener('input', (e) => {
                    this.draws.main.removeInvalidPlace(e.target);
                })
            });
        }

        // валидация даты рождения
        const birthdayInputs = [...this.draws.order.tourists.querySelectorAll('input[name=birthday]')];
        const noValidBirthday = birthdayInputs.filter(birthday => {
            return !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(birthday.value)
        });

        if(noValidBirthday.length) {
            noValidBirthday.forEach(input => {
                this.draws.main.setInvalidPlace(
                    input, 'Поле заполненно некорректно'
                );

                input.addEventListener('input', (e) => {
                    this.draws.main.removeInvalidPlace(e.target);
                })
            });
        }

        if(noFillInputs.length || noValidEmails.length || noValidPhones.length || noValidBirthday.length) {
            return false;
        }

        return true;
    }

    // сбор данных из форм туристов
    parseTourists() {
        const rooms = [...this.draws.order.tourists.querySelectorAll('.lkt-order__parts-item')];

        let data = [];

        rooms.forEach(room => {
            const roomName = room.querySelector('.lkt__part-opener-text').textContent;
            const roomTouristsForms = [...room.querySelectorAll('form')];

            let touristsData = [];

            // start
            roomTouristsForms.forEach(touristForm => {
                const touristTitle = touristForm.firstElementChild.textContent;

                const touristData = Object.fromEntries(new FormData(touristForm));

                touristsData.push(
                    {
                        title : touristTitle,
                        data : touristData,
                    }
                );
            }) // end

            data.push(
                {
                    roomTitle : roomName,
                    tourists : touristsData,
                }
            );
        })

        return data.length ? data : null;
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
                birthdays.forEach(birthday => {
                    const maskOptions = {
                        mask: '00/00/0000',
                        // lazy: true,
                        // placeholderChar: '0',
                    };
            
                    IMask(birthday, maskOptions);
                })
            }
        }

    }
}