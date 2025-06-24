// ФОРМА ПОДПИСКИ
const descriptionForm = document.querySelector('.subscr-i__form');
if(descriptionForm) {
    const Init = (await import('./form-description-i/Init.js')).default;
    Init.init(descriptionForm);
}

// ФОРМА РЕГИСТРАЦИИ АГЕНТА
const AgencyRegistrationForm = document.querySelector('.agent-reg__form');
if(AgencyRegistrationForm) {
    const Init = (await import('./form-agency-registration/Init.js')).default;
    Init.init(AgencyRegistrationForm);
}

