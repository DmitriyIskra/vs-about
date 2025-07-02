// ФОРМА ПОДПИСКИ
const subscriptionForm = document.querySelector('.subscr-i__form');
if(subscriptionForm) (await import('./form-subscription-i/Init.js')).default.init(subscriptionForm);

// ФОРМА РЕГИСТРАЦИИ АГЕНТА
const AgencyRegForm = document.querySelector('.agent-reg__form');
if(AgencyRegForm) (await import('./form-agency-registration/Init.js')).default.init(AgencyRegForm);

// СТРАНИЦА КОРПОРАТИВНЫМ КЛИЕНТАМ
const corporatClientPage = document.querySelector('.corp-cl__main');
if(corporatClientPage) (await import('./corporativnym-clientam/Init.js')).default.init(corporatClientPage);

