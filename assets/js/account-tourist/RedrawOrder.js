export default class Redraw {
    constructor(order, change, annulation) {
        this.order = order;
        this.change = change;
        this.annulation = annulation;
        
        // номер открытого заказа
        this.orderNum = this.order.querySelector('.lkt-order__data-number'); 
        // Форма и элементы на зменение заказа
        this.changeOrderForm = this.change.querySelector('.lkt-change__form');
        this.changeOrderTextArea = this.changeOrderForm.change_order_text;

        // Блок с формами для туристов
        this.tourists = this.order.querySelector('.lkt-order__parts'); 
        // Блок с согласием на обработку персональных данных
        this.agree = this.order.querySelector('.lkt-order__agree');

        // Дата в письменном согласии на обработку персональных данных
        this.agreeDate = this.order.querySelector('.lkt-order__agree-date');

        // -----------------------

        // активные (открытые аккордионы)
        this.activatedOpenners = [];
    }

    startOrder() {
        // start down openers которые должны быть активны со старта 
        const arrActivatedOpeners = [
            this.order.querySelector('.lkt-order__data-opener'),
            this.order.querySelector('.lkt-order__part-opener'), // !!!ВРЕМЕННО
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
        this.tourists.classList.add('.lkt-order__parts-active');
    }
    // открытие согласия на обработку персональных данных
    showAgree() {
        this.agree.classList.add('.lkt-order__agree_active');
    }

    // Заполнение формы туриста по данным заказчика (Совпадает с данными Заказчика)
    touristIsOrder() {

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