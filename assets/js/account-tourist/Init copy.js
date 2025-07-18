export default class Init {

    static async init(el) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const RedrawAside = (await import('./RedrawAside.js')).default;
        const Validation = (await import('../validation-places-form/ValidationPlacesForm.js')).default;

        const drows = {
            main: new Redraw(el),
            aside: new RedrawAside(el.querySelector('.lkt__aside')),
        }

        const controll = new Controll(
            drows,
            new Validation()
        )

        controll.init();
    }

}