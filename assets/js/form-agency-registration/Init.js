export default class InitFormAgencyRegistration {
    
    static async init(form) {
        const dialog = document.querySelector('dialog');

        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const SubmitApi = (await import('./SubmitApi.js')).default;
        const Validation = (await import('../validation-places-form/ValidationPlacesForm.js')).default;

        const controll = new Controll(new Redraw(form, dialog), new Validation(), new SubmitApi());
        controll.init();
    }

}