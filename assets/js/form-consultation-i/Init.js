export default class Init {

    static async init(form) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const RestApi = (await import('./RestApi.js')).default;

        const Loader = (await import('../loader/Controll.js')).default;

        const controll = new Controll(
            new Redraw(form),
            new RestApi(''),
            new Loader(),
        );

        controll.init();
    }

}