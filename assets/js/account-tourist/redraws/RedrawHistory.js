export default class Redraw {
    constructor(j) {
        this.j = j;
        
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

        const divCont = callback('div', ['lkt__journeys-content', 'lkt-history__content']);
        
        const divContTop = callback('div', ['lkt__journeys-content-top']);
        
        const divNumber = callback('div', ['lkt__journeys-number']);
        
        const divPrice = callback('div', ['lkt__journeys-price', 'lkt__history-price'], ' ₽');
        const spanPrice = callback('span', null, '');
        divPrice.prepend(spanPrice);

        const divName = callback('div', ['lkt__journeys-name']);
        divName.dataset.order = '';

        const divRoute = callback('div', ['lkt__journeys-route'], '');

        const divJData = callback('div', ['lkt__journeys-data']);
        const divJDate = callback('div', ['lkt__journeys-date'], '');
        divJData.append(divJDate);

        divContTop.append(divNumber);
        divContTop.append(divPrice);
        divContTop.append(divName);
        divContTop.append(divRoute);
        divContTop.append(divJData);

        divCont.append(divContTop);


        const ulStateList = callback('ul', ['lkt__journeys-state-list', 'lkt-history__wr-state']);
        ulStateList.dataset.state = '';

        const liStateItem = callback('li', [
            'lkt__journeys-state-item',
            `${'' === '' ? 'lkt-history__wr-completed' : ''}`
        ]);
        liStateItem.dataset.state = '';

        const divState = callback('div' [
            'lkt__journeys-state',
            `${'' === 'annulated' || '' === 'canceled' ? 'lkt__journeys-state_orange' : ''}` //!!!!!
        ]);
        switch('') {
            case '': divState.textContent = 'Оплачено';
            break;
            case '': divState.textContent = 'Аннулирован';
            break;
            case '': divState.textContent = 'Отменен';
            break;
            case '': divState.textContent = 'Выполнен';
            break;
            case '': divState.textContent = 'Запрос в работе';
        }
        liStateItem.append(divState);

        if('' === 'completed') {
            const a = callback('a', ['lkt-history__reviews-button'], 'Оставить отзыв');
            a.href = "#0";
            a.title = "Оставить отзыв";
            liStateItem.append(a);
        }

        ulStateList.append(liStateItem);

        divCont.append(ulStateList);

        return li;
    }
}