export default class Init {

    static async init(el) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const RedrawAside = (await import('./RedrawAside.js')).default;
        const RedrawOrder = (await import('./RedrawOrder.js')).default;
        const RedrawFavorites = (await import('./RedrawFavorites.js')).default;
        const RequestApi = (await import('./RequestApi.js')).default;
        const Validation = (await import('../validation-places-form/ValidationPlacesForm.js')).default;
        const Loader = (await import('../loader/Controll.js')).default;
        const InitDialog = (await import('../modal/InitDialog.js')).default;
        const dialog = await InitDialog.init();

        const drows = {
            main: new Redraw(el),
            aside: new RedrawAside(el.querySelector('.lkt__aside')),
            order: new RedrawOrder(
                el.querySelector('.lkt-order'),
                el.querySelector('.lkt-change'),
                el.querySelector('.lkt-annulation')
            ),
            fav: new RedrawFavorites(el.querySelector('.lkt-favorites')),
        }

        const controll = new Controll(
            drows,
            new RequestApi(),
            new Validation(),
            new Loader,
            dialog,
        )

        controll.init();
    }

}