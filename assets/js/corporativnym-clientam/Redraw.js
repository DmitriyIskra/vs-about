export default class Redraw {
    constructor(el) {
        this.el = el;

        this.support = this.el.querySelector('.corp-cl__support');
        
        this.swEl = this.el.querySelector('.corp-cl__sw');

        this.swInstance= null;
    }

}