function slider() {
    const btnPrev = document.querySelector(".offer__slider-prev");
    const btnNext = document.querySelector(".offer__slider-next");
    const slider = document.querySelector('.offer__slider');
    const slides = document.querySelectorAll('.offer__slide');
    const slidesField = document.querySelector(".offer__slider-inner");
    const slidesWrapper = document.querySelector(".offer__slider-wrapper");
    const width = window.getComputedStyle(slidesWrapper).width;
    let current = document.querySelector('#current');
    let total = document.querySelector('#total');
    let index = 1;
    let offset = 0;

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden'

    slides.forEach((slide) => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';
    const indicators = document.createElement('ol');
    const dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
       `
        if (i == 0) {
            dot.style.opacity = 1
        }
        indicators.append(dot);
        dots.push(dot)
    }

    if (slides.length > 10) {
        total.textContent = slides.length
        current.textContent = index
    } else {
        total.textContent = `0${slides.length}`
        current.textContent = `0${index}`
    }

    btnNext.addEventListener('click', () => {

        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        if (index == slides.length) {
            index = 1;
        } else {
            index++
        }

        if (slides.length > 10) {
            current.textContent = index
        } else {
            current.textContent = `0${index}`
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => {
            dot.style.opacity = '.5'
        });
        dots[index-1].style.opacity = 1;

        dots.forEach(dot => {
            dot.addEventListener('click', (event) => {
                const slideTo = event.target.getAttribute('data-slide-to');
                index = slideTo;
                offset = +width.slice(0, width.length - 2) * (slideTo - 1);

                slidesField.style.transform = `translateX(-${offset}px)`;

                if (slides.length > 10) {
                    current.textContent = index
                } else {
                    current.textContent = `0${index}`
                }

                dots.forEach(dot => {
                    dot.style.opacity = '.5'
                });
                dots[index-1].style.opacity = 1;
            })
        })

    });

    btnPrev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        if (index == 1) {
            index = slides.length
        } else {
            index--
        }

        if (slides.length > 10) {
            current.textContent = index
        } else {
            current.textContent = `0${index}`
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => {
            dot.style.opacity = '.5'
        });
        dots[index-1].style.opacity = 1
    });

}

export default slider