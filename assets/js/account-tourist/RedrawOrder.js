export default class Redraw {
    constructor(order, change, annulation) {
        this.order = order;
        this.change = change;
        this.annulation = annulation;
        
        this.ordererForm = this.order.querySelector('.lkt-order__orderer-form');

        // Блок с формами для туристов
        this.tourists = this.order.querySelector('.lkt-order__parts'); 
        // Блок с согласием на обработку персональных данных
        this.agree = this.order.querySelector('.lkt-order__agree');
        // Checkbox дано или нет соласие о персональных данных
        this.isAgree = this.agree.querySelector('.lkt-order__agree-box');
        // Блок с датой в соглашении о персональных данных
        this.agreeData = this.agree.querySelector('.lkt-order__agree-date');
        // Блок для данных заказчика
        this.placeAgreeOrderer = this.agree.querySelector('.lkt-order__agree-orderer');
        // Блок для данных туристов
        this.placeAgreeTourists = this.agree.querySelector('.lkt-order__agree-tourists');

        // Дата в письменном согласии на обработку персональных данных
        this.agreeDate = this.order.querySelector('.lkt-order__agree-date');

        // номер открытого заказа
        this.orderNum = this.order.querySelector('.lkt-order__data-number'); 
        // Форма и элементы на зменение заказа
        this.changeOrderForm = this.change.querySelector('.lkt-change__form');
        this.changeOrderTextArea = this.changeOrderForm.change_order_text;

        // Кнопка передать данные
        this.submit = this.order.querySelector('.lkt-order__submit');
        

        // -----------------------

        // активные (открытые аккордионы)
        this.activatedOpenners = [];
        // текущая первая форма туриста в номере Совпадает с данными заказчика
        this.currentMatchForm = null;
        // чекбокс в строке  "Совпадает с данными заказчика"
        this.currentMatchLabelBox = null;
    }

    startOrder() {
        // start down openers которые должны быть активны со старта 
        const arrActivatedOpeners = [
            this.order.querySelector('.lkt-order__data-opener'),
        ];
        arrActivatedOpeners.forEach(opener => {
            this.controllOpener(opener); // активируем
        });
        // end down openers которые должны быть активны со старта 


        // Дата в письменном согласии на обработку персональных данных
        const date = new Date();
        const todayDate = `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '00')}.${date.getFullYear()}`
        this.agreeDate.textContent = todayDate;
    }

    
    // START ЗАПРОС НА ИЗМЕНЕНИЯ ПО ЗАКАЗУ
    // авто заполнение номера заказа
    fillNumberOrderChange() {
        this.changeOrderForm.number_order.value = this.orderNum.dataset.order_num;
    }
    // END ЗАПРОС НА ИЗМЕНЕНИЯ ПО ЗАКАЗУ

    // открытие форм для туристов
    showTouristsForms() {
        if(!this.tourists.classList.contains('lkt-order__parts_active')) {
            this.tourists.classList.add('lkt-order__parts_active');
            this.controllOpener(this.order.querySelector('.lkt-order__part-opener'));
        }
    }
    // открытие согласия на обработку персональных данных
    showAgree() {
        if(!this.agree.classList.contains('lkt-order__agree_active')) {
            this.agree.classList.add('lkt-order__agree_active');
            this.controllOpener(this.order.querySelector('.lkt-order__agree-opener'));
        }
    }
    /**
     * @description заполнение данных в согласие о персональных данных
     * @param {String} orderer
     * @param {Array} tourists - массив HTML элементов  
     * */ 
    fillAgree(orderer, tourists) {
        this.placeAgreeOrderer.textContent = orderer;
        tourists.forEach(tourist => this.placeAgreeTourists.append(tourist));
    }

    // АВТОзаполнение формы туриста по данным заказчика (Совпадает с данными Заказчика)
    // traget - HTML элемент label радио кнопки, от него отталкиваемся при поиске формы
    // для заполнения
    touristIsOrder(target, data) {
        // принцип действия если уже заполнялось - очищаем, актуальную заполняем

        // когда уже был выбран пункт заполнить по данным заказчика, а потом его нажали в другой форме
        // или нажали на тот же пункт
        // очищает данные в текущей форме
        if(this.currentMatchForm && this.currentMatchLabelBox) {
            // выключаем чекбокс "Совпадает с данными заказчика"
            this.currentMatchLabelBox.checked = false;
            // очищаем данные формы
            this.currentMatchForm.reset();
            this.currentMatchForm.document.nextElementSibling.children[1]
                .textContent = 'Паспорт';
        };
        
        // Если чекбокс совпадает, был нажат а потом отжат
        if(this.currentMatchLabelBox && this.currentMatchLabelBox === target) {
            this.currentMatchLabelBox = null;
            this.currentMatchForm = null;
            return;
        };

        // заполнение данных и включение чекбокса
        // чекбокс в строке  "Совпадает с данными заказчика", включить
        this.currentMatchLabelBox = target;
        this.currentMatchLabelBox.checked = true;

        // форма первого туриста в данном номере
        this.currentMatchForm = target.closest('.lkt-order__data-content').querySelector('form');


        // Заполняем форму данными из заказчика
        // активируем чекбокс который говорит о том что данные этого туриста совпадают с данными заказчика
        this.currentMatchForm.touristMatchOrderer.checked = true;

        const dataKeys = Object.keys(data);
        dataKeys.forEach(key => {
            // заполнение текстовых полей
            if(this.currentMatchForm[key].type === 'text') this.currentMatchForm[key].value = data[key];
            // кнопка нет отчества
            if(key === 'patronimic-box' && data[key] === 'on') this.currentMatchForm[key].checked = true;
            // Отображение выбранного документа в select, в input селекта значение ставится в строке
            // а здесь нужно поставить в span, чтобы визуально отобразить документ
            if(key === 'document') this.currentMatchForm[key].nextElementSibling.children[1]
                .textContent = data[key];
        });
    }

    // START DOWN OPENER
    // управление аккордеоном (открывание и скрытие контента c 
    // разворачиванием или сворачиванием) down opener
    controllOpener(el) {
        // переворачиваем стрелку
        el.classList.toggle('lkt__down-opener_active');
        // получаем элемент который нужно открыть
        const openerContent = el.nextElementSibling;

        // если стрелка к этой строке в состоянии открыто (переключили строкой выше)
        // открываем элемент и сохраняем его в список открытых (активных)
        if(el.classList.contains('lkt__down-opener_active')) {
            // в конце открытия меняем правило CSS, устанавливаем inline чтобы перебить 
            // то что установленно в файле CSS
            openerContent.addEventListener('transitionend', () => {
                openerContent.style.overflow = 'visible';
            }, {once: true});

            // устанавливаем размер по высотам содержимого элемента и соответствующей
            // версии экрана единице измерения
            this.resizeActivatedOpener(openerContent);
            // сохраняем экземпляр, для пересчета размеров в дальнейшем
            // при смене версии экрана
            this.activatedOpenners.push(el); 
            return;
        }

        // в начале закрытия меняем правило CSS, убираем установленное ранее inline
        openerContent.addEventListener('transitionstart', () => {
            openerContent.style.overflow = '';
        }, {once: true});
        // если переданный элемент в состоянии закрытого
        // убираем его из массива открытых (активных)
        this.activatedOpenners = this.activatedOpenners.filter(item => item !== el);
        // закрываем
        openerContent.style.height = 0;
    }
    // пересчет размеров и перестановка единиц измерения (px - vw)
    resizeActivatedOpener(content) {
        let totalContentHeight = [...content.children].reduce((acc, item) => {
            return acc += item.offsetHeight;
        }, 0);

        // перевод во viewport
        if(innerWidth <= 1024) totalContentHeight = totalContentHeight / innerWidth * 100;

        content.style.height = `${totalContentHeight}${innerWidth <= 1024 ? 'vw' : 'px'}`;
    }

    // перемещение блока документы
    pasteDocs(docs) {
        this.order.append(docs);
    }
    cutDocs() {
        this.order.querySelector('.lkt-docs').remove();
    }


}