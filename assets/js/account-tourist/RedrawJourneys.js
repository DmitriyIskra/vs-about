export default class Redraw {
    constructor(el) {
        this.j = el;
        
        this.list = this.j.querySelector('.lkt__journeys-list');
    }

    drawCards(callback, data) {
        data.forEach(item => {
            const card = this.createCard(callback, item);
            this.list.append(card);
        });
    }

    createCard(callback, data) {
        const li = callback('li', ['lkt__journeys-item']);
        
        const divImg = callback('div', ['lkt__journeys-img']);
        const img = callback('img');
        img.src="";
        img.alt="";
        divImg.append(img);
        li.append(divImg);

        const divCont = callback('div', ['lkt__journeys-content']);
        
        const divContTop = callback('div', ['lkt__journeys-content-top']);
        
        const divNumber = callback('div', ['lkt__journeys-number']);
        const aNumber = callback('a', ['lkt__journeys-number-link', 'lkt__cont-switcher']);
        aNumber.dataset.order_num = '';
        aNumber.dataset.item = 'order';
        aNumber.title = `Заказ № ${''}`;
        aNumber.textContent = `Заказ № ${''}`;
        divNumber.append(aNumber);
        
        const divWarning = callback('div', [
            'lkt__journeys-warning',
            `${'' === '' ? 'lkt__journeys-warning_active' : ''}`
        ], 'Внесите данные туристов');
        const divPrice = callback('div', ['lkt__journeys-price'], ' ₽');
        
        const spanPrice = callback('span', null, '');
        divPrice.prepend(spanPrice);

        const divName = callback('div', ['lkt__journeys-name']);
        divName.dataset.order = '';
        const aName = callback('a', ['lkt__journeys-name-link', 'lkt__cont-switcher']);
        aNumber.dataset.order_num = '';
        aNumber.dataset.item = 'order';
        aNumber.title = `Заказ № ${''}`;
        aNumber.textContent = '';
        divName.append(aName);

        const divRoute = callback('div', ['lkt__journeys-route'], '');

        const divJData = callback('div', ['lkt__journeys-data']);
        const divJDate = callback('div', ['lkt__journeys-date'], '');
        const divJWrDoc = callback('div', ['lkt__journeys-wr-doc']);
        const aJDoc = callback('a', ['lkt__journeys-doc']);
        aJDoc.href = '';
        aJDoc.title = 'Программа тура';
        aJDoc.target="_blank";
        divJWrDoc.append(aJDoc);
        divJData.append(divJDate);
        divJData.append(divJWrDoc);

        divContTop.append(divNumber);
        divContTop.append(divWarning);
        divContTop.append(divPrice);
        divContTop.append(divName);
        divContTop.append(divRoute);
        divContTop.append(divJData);

        divCont.append(divContTop);


        const ulStateList = callback('ul', ['lkt__journeys-state-list']);
        ulStateList.dataset.state = '';

        const liStateItem = callback('li', [
            'lkt__journeys-state-item',
            `${'' === '' ? 'lkt__journeys-state-button' : 0}`
        ]);
        liStateItem.dataset.state = '';

        const divStateInfo = callback('div', ['lkt__journeys-state-info']);
        const divState = callback('div' [
            'lkt__journeys-state',
            `${'' === 'paid' || '' === 'canceled' ? 'lkt__journeys-state_orange' : ''}`
        ]);
        switch('') {
            case '': divState.textContent = 'Бронь';
            break;
            case '': divState.textContent = 'Оплачено';
            break;
            case '': divState.textContent = 'Отменен';
            break;
            case '': divState.textContent = 'Аннуляция';
            break;
            case '': divState.textContent = 'Аннулирован';
        }
        divStateInfo.append(divState);
        if('' !== 'paid') { // !!!!!!
            const divComment = callback('div', [
                'lkt__journeys-comment',
                'lkt__journeys-comment_bold',
                `${'' === 'annulated' ? 'lkt__journeys-comment_annulated' : ''}` // !!!! annulated
            ]);
            divComment.dataset.state = `${'' ? 'refund' : '' ? 'end' : ''}`; // !!!!! 
            switch('') {
                case '': 
                    divComment.textContent = 'Оплачено';
                    const spanBooking = callback('span');
                    spanBooking.textContent = `${''} из ${''} ₽`;
                    divComment.append(spanBooking);
                break;
                case '': divComment.textContent = `К возврату: ${''} ₽`;
                break;
                case '': divComment.textContent = 'Запрос в работе';
                break;
                case '': divComment.textContent = `К возврату ${''} ₽`;
                break;
                case '': divComment.textContent = 'Расчет завершен';
            };
            divStateInfo.append(divComment);
        }
        liStateItem.append(divStateInfo);

        if('' === 'booking') { // !!!!!!
            const divJPay = callback('div', ['lkt__journeys-pay']);
            const divJBefore = callback('div', ['lkt__journeys-before'], `Оплатить до: ${''}`);
            const divJPaySumm = callback('div', ['lkt__journeys-pay-summ'], ' ₽');
            const spanJPaySumm = callback('span', null, `${''}`);
            divJPaySumm.prepend(spanJPaySumm);
            
            divJPay.append(divJBefore);
            divJPay.append(divJPaySumm);

            liStateItem.append(divJPay);
        }

        const divJConfirm = callback('div', ['lkt__journeys-confirm']);

        const divJBoxLabel = callback('div', ['lkt__checkbox-label', 'lkt__journeys-label-confirm']);
        const inputJBox = callback('input', ['lkt__checkbox', 'lkt__journeys-checkbox']);
        inputJBox.type = 'checkbox';
        inputJBox.name = 'confirm-agreement';
        inputJBox.value = 1;
        divJBoxLabel.append(inputJBox);
        const spanJBoxTitle = callback('span', ['lkt__checkbox-title', 'lkt__journeys-box-title']);
        spanJBoxTitle.textContent = 'Подтверждаю ознакомление и согласие';
        const br = callback('br');
        spanJBoxTitle.append(br);
        spanJBoxTitle.append('с условиями ');
        const aAgreementLink = callback('a', ['lkt__journeys-agreement-link'], 'Договора публичной оферты.');
        aAgreementLink.href='#0';
        aAgreementLink.title = 'Договор публичной оферты';
        spanJBoxTitle.append(aAgreementLink);
        divJBoxLabel.append(spanJBoxTitle);

        divJConfirm.append(divJBoxLabel);

        liStateItem.append(divJConfirm);

        if('' === 'booking') { // !!!!!!
            const divJWrButton = callback('div', ['lkt__journeys-wr-button']);
            const aJbuttonPay = callback('div', [
                'lkt__journeys-button', 'lkt__button-pay', 'lkt__button_disabled'
            ], 'Оплатить');
            aJbuttonPay.href="#0";
            aJbuttonPay.rel = 'nofollow';
            aJbuttonPay.title = 'Оплата тура';

            divJWrButton.append(aJbuttonPay);

            liStateItem.append(divJWrButton);
        } 

        return li;
    }
}