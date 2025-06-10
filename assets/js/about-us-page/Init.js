export default class InitAboutUs {

    static async init(form) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const RestApi = (await import('./RestApi.js')).default;

        const redraw = new Redraw(form);
        const restApi = new RestApi('');
        const controll = new Controll(redraw, restApi);

        controll.init();
    }

}