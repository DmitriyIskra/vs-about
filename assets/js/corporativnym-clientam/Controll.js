export default class Controll {
    constructor(redraw) {
        this.redraw = redraw;
        
        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();

        this.startSwiper();
    }

    startSwiper() {
        this.redraw.swInstance = new Swiper(this.redraw.swEl, {
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
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    click(e) {
        if(e.target.closest('.corp-cl__anchor')) {
            e.preventDefault();

            this.redraw.support.scrollIntoView({ behavior: 'smooth', block: 'center'});
        }
    }
}