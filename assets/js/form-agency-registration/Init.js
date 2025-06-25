export default class InitFormAgencyRegistration {
    
    static async init(form) {
        const Controll = (await import('./Controll.js')).default;
        const Redraw = (await import('./Redraw.js')).default;
        const SubmitApi = (await import('./SubmitApi.js')).default;
        const Validation = (await import('../validation-places-form/ValidationPlacesForm.js')).default;

        const Loader = (await import('../loader/Controll.js')).default;
        const InitDialog = (await import('../modal/InitDialog.js')).default;
        const dialog = await InitDialog.init();

        const controll = new Controll(
            new Redraw(form), 
            new Validation(), 
            new SubmitApi(null),
            new Loader(),
            dialog
        );
        controll.init();
    }

}