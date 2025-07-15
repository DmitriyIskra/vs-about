// ФОРМА ПОДПИСКИ
const subscriptionForm = document.querySelector('.subscr-i__form');
if(subscriptionForm) (await import('./form-subscription-i/Init.js')).default.init(subscriptionForm);

// ФОРМА ЗАЯВКИ НА КОНСУЛЬТАЦИЮ (support)
const consultationForm = document.querySelector('.consultation__form');
if(consultationForm) (await import('./form-consultation-i/Init.js')).default.init(consultationForm);

// ФОРМА РЕГИСТРАЦИИ АГЕНТА
const AgencyRegForm = document.querySelector('.agent-reg__form');
if(AgencyRegForm) (await import('./form-agency-registration/Init.js')).default.init(AgencyRegForm);

// СТРАНИЦА КОРПОРАТИВНЫМ КЛИЕНТАМ
/**
 * @param corporatClientPage страница (элемент которым управляем)
 * @param 5000 таймаут до смены строки в баннере
 * */ 
const corporatClientPage = document.querySelector('.corp-cl__main');
if(corporatClientPage) (await import('./corporativnym-clientam/Init.js'))
    .default.init(corporatClientPage, 5000);


// ЛИЧНЫЙ КАБИНЕТ ТУРИСТА
const accountTourist = document.querySelector('.lkt');
if(accountTourist) (await import('./account-tourist/Init.js')).default.init(accountTourist);

