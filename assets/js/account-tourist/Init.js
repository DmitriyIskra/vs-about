export default class Init {

    static async init(el) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const Validation = (await import('../validation-places-form/ValidationPlacesForm.js')).default;

        const controll = new Controll(
            new Redraw(el),
            new Validation()
        )

        controll.init();
    }

}