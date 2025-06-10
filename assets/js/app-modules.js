// ФОРМА ПОДПИСКИ
const descriptionForm = document.querySelector('.subscr-i__form');
if(descriptionForm) {
    const InitAboutUs = (await import('./about-us-page/Init.js')).default;
    InitAboutUs.init(descriptionForm);
}