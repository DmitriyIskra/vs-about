export default class InitDialog {

    static async init() {
        const element = document.querySelector('dialog');
        const Redraw = (await (import('./Redraw.js'))).default;
        const Dialog = (await (import('./Controll.js'))).default;
        
        return new Dialog(new Redraw(element));
    }

}