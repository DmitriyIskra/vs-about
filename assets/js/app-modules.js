const contentAboutUs = document.querySelector('.about-us__content');
if(contentAboutUs) {
    const InitAboutUs = (await import('./about-us-page/Init.js')).default;
    InitAboutUs.init(contentAboutUs);
}