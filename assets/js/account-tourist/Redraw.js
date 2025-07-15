export default class Redraw {
    constructor(el) {
        this.el = el;
        this.contentWrapper = this.el.querySelector('.lkt-main__content');
        this.asideDocs = this.el.querySelector('.lkt-docs');

        // активный контент
        this.currentActiveContent = this.contentWrapper.children[0];        
        // активный элемент переключатель контента
        this.currentActiveSwitcher = this.el.querySelector('.lkt__header-list').children[0];    
        
        // активные (открытые аккордионы)
        this.activeOpenners = [];
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
    }

    reCalc() {
        // пересчет опенеров (хранятся здесь this.activeOpenners = [];)
    }
    
    // перемещение документов !!! когда будет готов переместить в блок DOCS
    relocationDocs() {

    }

    // START CHANGE CONTENT
    // Переключение контента
    switchContent(param) {
        this.contentWrapper.dataset.content = param;
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
}