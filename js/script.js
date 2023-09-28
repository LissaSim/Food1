window.addEventListener("DOMContentLoaded", () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent'),
        tabParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.style.display = 'none'
        });
        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active")
        });
    }

    function showTabContent(i) {
        tabContent[i].style.display = "block";
        tabs[i].classList.add("tabheader__item_active")
    };

    hideTabContent();
    showTabContent(0);

    tabParent.addEventListener("click", (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })

    // Timer
    const deadline = '2024-09-03';

    function getTime(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);


        function updateClock() {
            const t = getTime(endtime);
            days.innerHTML = t.days;
            hours.innerHTML = t.hours;
            minutes.innerHTML = t.minutes;
            seconds.innerHTML = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval)
            }
        }
    }

    setClock('.timer', deadline);

    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener("click", openModal)
    })

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') === '') {
            closeModal()
        }
    })
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal()
        }
    })

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 39;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
             <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element)
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }
        return await res.json()
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
            })
        })

    const forms = document.querySelectorAll('form');
    const messages = {
        loading: 'Загрузка...',
        success: 'Спасибо! Мы скоро с вами свяжемся',
        fail: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item)
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: data
        })
        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const statusMessages = document.createElement('div');
            statusMessages.classList.add('status');
            statusMessages.textContent = messages.loading;
            form.append(statusMessages);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data)
                    showThanksModal(messages.success);
                    statusMessages.remove()
                }).catch(() => {
                showThanksModal(messages.fail)
            }).finally(() => {
                form.reset();
            })
        })
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');

        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class ="modal-content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
        </div>
        `
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModal.classList.add('show');
            prevModal.classList.remove('hide');
            closeModal()
        }, 4000)
    }

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

    const result = document.querySelector(".calculating__result span")
    let sex, height, weight, age, ratio

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex')
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female')
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio')
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375)
    }
        function calcTotal() {
            if (!sex || !height || !weight || !age || !ratio) {
                result.textContent = `____`;
                return
            }
            if (sex === 'female') {
                result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
            }
            if (sex === "male") {
                result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
            }
        }
        calcTotal()
    function setLocalInformation(selector,classActive) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.classList.remove(classActive);
            if(element.getAttribute('id') === localStorage.getItem('sex')) {
                element.classList.add(classActive)
            }
            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                element.classList.add(classActive)
            }
        })
    }

    setLocalInformation('#gender div', 'calculating__choose-item_active');
    setLocalInformation(".calculating__choose_big div", 'calculating__choose-item_active')
        function getStaticInformation(selector, classActive) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(elem => {
                elem.addEventListener('click', (event) => {
                    if (event.target.getAttribute('data-ratio')) {
                        ratio = +event.target.getAttribute('data-ratio');
                        localStorage.setItem('ratio',+event.target.getAttribute('data-ratio'))
                    } else {
                        sex = event.target.getAttribute('id');
                        localStorage.setItem('sex',event.target.getAttribute('id'))
                    }

                    elements.forEach(elem => {
                        elem.classList.remove(classActive)
                    })
                    event.target.classList.add(classActive)
                    calcTotal()
                })
            })

        }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation(".calculating__choose_big div", 'calculating__choose-item_active');
        function getDynamicInformation(selector) {
        const  input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if(input.value.match(/\D/g)) {
                input.style.border = '1px solid red'
            } else {
                input.style.border = 'none'
            }
            switch (input.getAttribute('id')) {
                case 'height' :
                    height = +input.value
                    break;
                case 'weight' :
                    weight = +input.value
                    break;
                case 'age' :
                    age = +input.value
                    break
            }
            calcTotal()
        })
        }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
})