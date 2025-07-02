// ФОРМА ПОДПИСКИ
const descriptionForm = document.querySelector('.subscr-i__form');
if(descriptionForm) {
    const Init = (await import('./form-subscription-i/Init.js')).default;
    Init.init(descriptionForm);
}

// ФОРМА РЕГИСТРАЦИИ АГЕНТА
const AgencyRegistrationForm = document.querySelector('.agent-reg__form');
if(AgencyRegistrationForm) {
    const Init = (await import('./form-agency-registration/Init.js')).default;
    Init.init(AgencyRegistrationForm);
}

// СТРАНИЦА КОРПОРАТИВНЫМ КЛИЕНТАМ
const corporatClientPage = document.querySelector('.corp-cl__main');

const swiper = new Swiper('.corp-cl__sw', {
    direction: 'horizontal',
    loop: true,
    grabCursor: true,
    

    navigation: {
      nextEl: '.corp-cl__button-prev',
      prevEl: '.corp-cl__button-next',
    },
    breakpoints: {
        320: {
            cssMode: true,
            slidesPerView: 1.56,
            spaceBetween: 0, 
            centeredSlides: true,
        },
        1025: {
            slidesPerView: 3,
            spaceBetween: 18,
        },
    }
  });