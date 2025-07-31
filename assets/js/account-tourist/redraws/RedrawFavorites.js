export default class Redraw {
    constructor(fav) {
        this.fav = fav;
        
        this.list = this.fav.querySelector('.lkt-favorites__list');
    }

    removeCard(id) {
        const card = this.list.querySelector(`.lkt-favorites__item[data-id="${id}"]`);
        card.remove();
    }

    drawCards(callback, data) {
        data.forEach(item => {
            const card = this.createCard(callback, data);
            this.list.append(card);
        });
    }

    createCard(callback, data) {
        // lkt-favorites__item_disabled
        const li = callback('li', ['lkt-favorites__item']);
        
        const img = callback('img');
        img.src = "";
        img.alt = "";
        
        const divContent = callback('div', ['lkt-favorites__item-content']);
        
        const buttonHeart = callback('button', ['lkt-favorites__item-heart']);
        buttonHeart.type = "button";
        buttonHeart.dataset.id = '';

        const divDescr = callback('div', ['lkt-favorites__item-description']);

        const h3Title = callback('h3', ['lkt-favorites__item-title'], '');

        const pText = callback('p', ['lkt-favorites__item-text'], '');
        
        const aLink = callback('a', ['lkt-favorites__item-button-link']);
        aLink.href = '';
        aLink.title = '';

        divDescr.append(h3Title);
        divDescr.append(pText);
        divDescr.append(aLink);

        divContent.append(buttonHeart);
        divContent.append(divDescr);

        li.append(img);
        li.append(divContent);

        return li;
    }
}