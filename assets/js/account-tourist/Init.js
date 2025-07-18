export default class Init {

    static async init(el) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const RedrawAside = (await import('./RedrawAside.js')).default;
        const RedrawOrder = (await import('./RedrawOrder.js')).default;
        const Validation = (await import('../validation-places-form/ValidationPlacesForm.js')).default;

        const drows = {
            main: new Redraw(el),
            aside: new RedrawAside(el.querySelector('.lkt__aside')),
            order: new RedrawOrder(
                el.querySelector('.lkt-order'),
                el.querySelector('.lkt-change'),
                el.querySelector('.lkt-annulation')
            ),
        }

        const controll = new Controll(
            drows,
            new Validation()
        )

        controll.init();
    }

}