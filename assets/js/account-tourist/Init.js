export default class Init {

    static async init(el) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;

        const controll = new Controll(
            new Redraw(el)
        )

        controll.init();
    }

}