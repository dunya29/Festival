const overlay = document.querySelector(".overlay")
const header = document.querySelector(".header")
const mobMenu = document.querySelector('.header__mob');
const menuShowBtn = document.querySelector('.menu-show-btn');
const menuCloseBtn = document.querySelector('.menu-close-btn');
const modals = document.querySelectorAll(".modal")
const successModal = document.querySelector("#success-modal")
const errorModal = document.querySelector("#error-modal")
const dropdowns = document.querySelectorAll(".dropdown")
const cookiePopup = document.querySelector("#cookie-popup")
let animSpd = 400

let bp = {
    largeDesktop: 1535.98,
    desktop: 1279.98,
    laptop: 1023.98,
    tablet: 767.98,
    phone: 575.98,
    phoneSm: 479.98
}
// === Utils ===
const Utils = {
    init() {
        // Сookie
        this.CookieUtils.init();
        // Скролл и header
        this.ScrollUtils.init();
        // Модалки
        this.ModalUtils.init();
        // Формы
        this.FormUtils.init();
        // Инициализация свайперов
        this.SwiperUtils.init()
    },
    ScrollUtils: {
        init() {
            this.initHeaderHeight()
            this.initCustomScroll()
           // this.initScrollHandlers()
        },
        isIOS: (() => {
            const platform = navigator.platform;
            const userAgent = navigator.userAgent;
            return (
                /(iPhone|iPod|iPad)/i.test(platform) ||
                (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream) ||
                (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
            );
        })(),
        initHeaderHeight() {
            if (!header) return;
            const updateHeight = () => {
                let height = header.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--header-h', height + 'px');
            };
            const resizeObserver = new ResizeObserver(updateHeight);
            resizeObserver.observe(header);
        },
        initCustomScroll() {
            const customScroll = document.querySelectorAll(".custom-scroll");
            const isFirefox = typeof InstallTrigger !== 'undefined';
            if (!isFirefox || !customScroll.length) return;

            document.documentElement.style.scrollbarWidth = "thin";
            document.documentElement.style.scrollbarColor = "#591A0B #EAE6E1";
            customScroll.forEach(item => { item.style.scrollbarWidth = "thin"; item.style.scrollbarColor = "#591A0B transparent" });

        },
        initScrollHandlers() {
            let lastScroll = this.scrollPos();
            window.addEventListener("scroll", () => {
                let currentScroll = this.scrollPos();
                let winH = window.innerHeight
                this.handleHeaderScroll(currentScroll, lastScroll);
                lastScroll = currentScroll;
            });
        },
        handleHeaderScroll(currentScroll, lastScroll) {
            if (!header) return
            if (currentScroll > 1) {
                header.classList.add("scroll");
                if (currentScroll > lastScroll && currentScroll > 150 && !header.classList.contains("unshow")) {
                    header.classList.add("unshow");
                } else if (currentScroll < lastScroll && header.classList.contains("unshow")) {
                    header.classList.remove("unshow");
                }
            } else {
                header.classList.remove("scroll");
                header.classList.remove("unshow");
            }
        },
        scrollPos() {
            return window.scrollY || window.pageYOffset || document.documentElement.scrollTop
        },
        disable() {
            if (!document.querySelector(".modal.open")) {
                const paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : '0px';
                document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue);
                document.body.style.paddingRight = paddingValue;
                document.body.classList.add("no-scroll");

                if (this.isIOS) {
                    const scrollY = window.scrollY;
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                    document.body.style.top = `-${scrollY}px`;
                    document.body.dataset.scrollY = scrollY;
                }
            }
        },
        enable() {
            if (!document.querySelector(".modal.open")) {
                document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px');
                document.body.style.paddingRight = '0px';
                document.body.classList.remove("no-scroll");

                if (this.isIOS) {
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    const scrollY = parseInt(document.body.dataset.scrollY || '0');
                    window.scrollTo(0, scrollY);
                }
            }
        },
        smoothScrollTo(dest) {
            let destPos = dest.getBoundingClientRect().top < 0 ? dest.getBoundingClientRect().top - header.clientHeight - 10 : dest.getBoundingClientRect().top - 10
            if (header && header.classList.contains("show-menu")) {
                menuCloseBtn.click()
                console.log("dddb")
                setTimeout(() => {
                    window.scrollTo({ top: Utils.ScrollUtils.scrollPos() + destPos, behavior: 'smooth' })
                }, 300);
            } else {
                window.scrollTo({ top: Utils.ScrollUtils.scrollPos() + destPos, behavior: 'smooth' })
            }
        }
    },
    CookieUtils: {
        COOKIE_NAME: 'site_cookie_consent',
        COOKIE_VALUE: 'accepted',
        COOKIE_DAYS: 365,
        init() {
            if (!cookiePopup) return;
            if (!this.hasCookieAccepted()) {
                this.show();
                const cookieAccept = cookiePopup.querySelector(".cookie__accept");
                if (cookieAccept) {
                    cookieAccept.addEventListener('click', () => {
                        this.setCookie();
                        this.hide();
                    });
                }
            } else {
                this.hide();
            }
        },
        setCookie() {
            const date = new Date();
            date.setTime(date.getTime() + this.COOKIE_DAYS * 24 * 60 * 60 * 1000);
            const expires = "expires=" + date.toUTCString();
            let cookieStr = `${this.COOKIE_NAME}=${encodeURIComponent(this.COOKIE_VALUE)}; ${expires}; path=/; SameSite=Lax`;
            if (location.protocol === 'https:') cookieStr += '; Secure';
            document.cookie = cookieStr;
        },
        hasCookieAccepted() {
            const cookies = document.cookie.split('; ');
            const pref = this.COOKIE_NAME + '=';
            const cookieItem = cookies.find(item => item.startsWith(pref));
            return cookieItem ? decodeURIComponent(cookieItem.substring(pref.length)) === this.COOKIE_VALUE : false;
        },
        show() {
            cookiePopup.classList.add("show");
            cookiePopup.setAttribute('aria-hidden', 'false');
        },
        hide() {
            cookiePopup.classList.remove("show");
            setTimeout(() => {
                cookiePopup.remove();
            }, 300);
        }
    },
    ModalUtils: {
        lastFocusedEl: null,
        _focusHandler: null,
        _escInited: false,
        init() {
            this.initModalClicks()
            this.initEscClose()
            this.modalShowBtns()
            this.modalUnshowBtns()
        },
        initModalClicks() {
            modals.forEach(mod => {
                mod.addEventListener("click", (e) => {
                    if (!mod.querySelector(".modal__content").contains(e.target)) {
                        this.closeModal(mod)
                    }
                })
                // кнопки закрытия внутри модалки
                mod.querySelectorAll(".modal__close").forEach(btn => {
                    btn.addEventListener("click", () => {
                        this.closeModal(mod)
                    })
                })
            })
        },
        initEscClose() {
            if (this._escInited) return
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    const modals = document.querySelectorAll(".modal.open")
                    const topModal = modals[modals.length - 1]
                    if (topModal) {
                        this.closeModal(topModal)
                    }
                }
            })
            this._escInited = true
        },
        modalShowBtns() {
            const modOpenBtn = document.querySelectorAll(".mod-open-btn")
            if (modOpenBtn.length) {
                modOpenBtn.forEach(btn => {
                    btn.addEventListener("click", e => {
                        e.preventDefault()
                        let href = btn.getAttribute("data-modal")
                        this.openModal(document.getElementById(href))
                    })
                })
            }
        },
        modalUnshowBtns() {
            const modCloseBtn = document.querySelectorAll(".mod-close-btn")
            if (modCloseBtn.length) {
                modCloseBtn.forEach(btn => {
                    btn.addEventListener("click", e => {
                        e.preventDefault()
                        let href = btn.getAttribute("data-modal")
                        this.closeModal(document.getElementById(href))
                    })
                })
            }
        },
        openModal(modal, closeActive = true) {
            const activeModal = document.querySelector(".modal.open")
            if (!activeModal) {
                this.lastFocusedEl = document.activeElement
                Utils.ScrollUtils.disable()
            } else {
                if (closeActive) {
                    activeModal.classList.remove("open")
                }
                this.removeFocusTrap()
            }
            modal.classList.add("open")
            this.trapFocus(modal)
        },
        closeModal(modal) {
            if (modal.querySelector("video")) {
                modal.querySelectorAll("video").forEach(v => v.pause())
            }
            modal.classList.remove("open")
            this.removeFocusTrap()
            const activeModal = document.querySelector(".modal.open")

            if (activeModal) {
                this.trapFocus(activeModal)
            } else {
                if (this.lastFocusedEl) {
                    this.lastFocusedEl.focus()
                }
                setTimeout(() => {
                    Utils.ScrollUtils.enable()
                }, animSpd)
            }
        },
        trapFocus(modal) {
            const focusable = modal.querySelectorAll(
                'a, button, input, textarea, [tabindex]:not([tabindex="-1"])'
            )
            if (!focusable.length) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            first.focus()
            this._focusHandler = (e) => {
                if (e.key !== "Tab") return
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault()
                        last.focus()
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault()
                        first.focus()
                    }
                }
            }
            document.addEventListener("keydown", this._focusHandler)
        },
        removeFocusTrap() {
            if (this._focusHandler) {
                document.removeEventListener("keydown", this._focusHandler)
                this._focusHandler = null
            }
        },
        setSuccessTxt(title = false, txt = false) {
            successModal.querySelector(".h3").innerHTML = title ? title : "Отправлено"
            successModal.querySelector("p").innerHTML = txt ? txt : "Спасибо! Мы получили ваше сообщение и свяжемся с вами в ближайшее время."
        },
        setErrorTxt(title = false, txt = false) {
            errorModal.querySelector(".h3").innerHTML = title ? title : "Не удалось отправить"
            errorModal.querySelector("p").innerHTML = txt ? txt : "Что-то пошло не так...<br>Попробуйте заполнить форму еще раз или свяжитесь с нами другим удобным способом."
        },
        openSuccessMod(title = false, txt = false) {
            this.setSuccessTxt(title, txt)
            this.openModal(successModal)
        },
        openErrorMod(title = false, txt = false) {
            this.setErrorTxt(title, txt)
            this.openModal(errorModal)
        }
    },
    FormUtils: {
        init() {
            this.initTelMask();
        },
        initTelMask(selector = 'input[type=tel]') {
            const self = this;
            document.querySelectorAll(selector).forEach(item => {
                Inputmask(
                    {
                        mask: "+7 999 999-99-99",
                        oncomplete: () => {
                            this.removeError(item)
                        },
                    }
                ).mask(item);
            });
        },
        isPhone(value) {
            return /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/.test(value);
        },
        isEmail(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,8}$/.test(value);
        },
        isInputValid(inp) {
            if (inp.type === 'checkbox' || inp.type === 'radio') {
                return inp.checked;
            }
            if (!inp.value) return false;
            if (inp.type === 'email') {
                return this.isEmail(inp.value);
            }
            if (inp.type === 'tel') {
                return inp.inputmask?.isComplete();
            }
            return true;
        },
        formReset(form, cleanError = false) {
            form.querySelectorAll(".ui-input").forEach(item => item.classList.remove("error"));
            if (cleanError) form.querySelectorAll("[data-error]").forEach(el => el.textContent = '');
            form.querySelectorAll("input").forEach(inp => {
                if (!["hidden", "checkbox", "radio"].includes(inp.type)) inp.value = "";
                if (["checkbox", "radio"].includes(inp.type) && !inp.required) inp.checked = false;
            });
            if (form.querySelector("textarea")) form.querySelector("textarea").value = "";
            if (form.querySelector(".file-form__items")) form.querySelector(".file-form__items").innerHTML = "";
        },
        addError(inp) {
            inp.closest('.ui-control')?.classList.add('error');
        },
        removeError(inp) {
            inp.closest('.ui-control')?.classList.remove('error');
        },
        formValidate(e, form) {
            e.preventDefault();
            let errors = 0;
            const inpRequired = Array.from(form.querySelectorAll('input[required]'))
            if (inpRequired.length) {
                inpRequired.forEach(inp => {
                    if (!this.isInputValid(inp)) {
                        errors++;
                        this.addError(inp);
                    }
                    const eventType = ['text', 'email', 'number'].includes(inp.type) ? 'input' : 'change';
                    inp.addEventListener(eventType, () => {
                        if (this.isInputValid(inp)) {
                            this.removeError(inp)
                        }
                    });
                });
            }
            if (errors === 0) {
                form.requestSubmit();
            }
        }
    },
    SwiperUtils: {
        defaults(slider) {
            return {
                observer: true,
                observeParents: true,
                watchSlidesProgress: true,
                navigation: {
                    prevEl: slider.querySelector(".nav-btn--prev"),
                    nextEl: slider.querySelector(".nav-btn--next"),
                },
                pagination: {
                    el: slider.querySelector(".swiper-pagination"),
                    type: "bullets",
                    clickable: true,
                },
                scrollbar: {
                    el: slider.querySelector(".swiper-scrollbar"),
                    draggable: true,
                },
                speed: 800,
            };
        },
        init() {
            this.initSwiper7();
            this.initSwiper4();
        },
        initSwiper7() {
            const swiper7 = document.querySelectorAll('.swiper-7');
            swiper7.forEach(item => {
                const options = {
                    ...this.defaults(item),
                    slidesPerView: 2.2,
                    spaceBetween: 6,
                    autoplay: this.autoplay(item),
                    breakpoints: {
                        1030.98: {
                            slidesPerView: 7
                        },
                        767.98: {
                            slidesPerView: 5
                        },
                        479.98: {
                            slidesPerView: 4
                        }
                    },
                };
                new Swiper(item.querySelector(".swiper"), options);
            });
        },
        initSwiper4() {
            const swiper4 = document.querySelectorAll('.swiper-4');
            swiper4.forEach(item => {
                const options = {
                    ...this.defaults(item),
                    slidesPerView: 1.8,
                    spaceBetween: 10,
                    autoplay: this.autoplay(item),
                    breakpoints: {
                        1030.98: {
                            slidesPerView: 4
                        },
                        767.98: {
                            slidesPerView: 3
                        },
                        479.98: {
                            slidesPerView: 2
                        }
                    },
                };
                new Swiper(item.querySelector(".swiper"), options);
            });
        },
        autoplay(slider) {
            let autoplayAttr = slider.dataset.autoplay;
            let autoplayOption = autoplayAttr === "true" ? { delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: false } : false;
            return autoplayOption

        }
    }
}
const preloader = document.querySelector(".preloader")
let preloaderHiddenTimeOut = 0
if (preloader) {
    preloaderHiddenTimeOut = 1800
    Utils.ScrollUtils.enable()
    Utils.ScrollUtils.disable()
    setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            Utils.ScrollUtils.enable()
            ScrollTrigger.refresh()
        }, 400);
    }, 1400);
}
window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".wrap").classList.add('loaded')
    Utils.init()
    setTimeout(() => {
        animate()
    }, 0);

    // === Menu ===
    if (menuShowBtn && header) {
        menuShowBtn.addEventListener("click", () => {
            header.classList.add("show-menu")
            Utils.ScrollUtils.disable()
        })
    }
    if (menuCloseBtn && header) {
        menuCloseBtn.addEventListener("click", () => {
            header.classList.remove("show-menu")
            Utils.ScrollUtils.enable()
        })
    }

    // === Anchor Links ===
    const anchorLinks = document.querySelectorAll(".js-anchor")
    anchorLinks.forEach(item => {
        item.addEventListener("click", e => {
            let idx = item.getAttribute("href").indexOf("#")
            const href = item.getAttribute("href").substring(idx)
            let dest = document.querySelector(href)
            if (dest) {
                e.preventDefault()
                Utils.ScrollUtils.smoothScrollTo(dest)
            }
        })
    })

    // === Accordion ===
    const accordion = document.querySelectorAll(".accordion")
    accordion.forEach(item => {
        item.querySelector(".accordion__header").addEventListener("click", () => {
            if (!item.classList.contains("no-close")) {
                item.parentNode.parentNode.querySelectorAll(".accordion").forEach(el => {
                    if (el.querySelector(".accordion__header").classList.contains("active")) {
                        smoothDrop(el.querySelector(".accordion__header"), el.querySelector(".accordion__body"))
                        if (el.getBoundingClientRect().top < 0) {
                            let pos = Utils.ScrollUtils.scrollPos() + item.getBoundingClientRect().top - el.querySelector(".accordion__body").clientHeight - header.clientHeight - 10
                            window.scrollTo(0, pos)
                        }
                    }
                })
            }
            smoothDrop(item.querySelector(".accordion__header"), item.querySelector(".accordion__body"))
        })
    })

    // === Gallery ===
    const gallerySwiper = document.querySelector(".gallery .swiper")
    if (gallerySwiper) {
        const options = {
            ...Utils.SwiperUtils.defaults(gallerySwiper),
            slidesPerView: "auto",
            spaceBetween: 6
        };
        new Swiper(gallerySwiper, options);
    }
});

window.addEventListener("scroll", animate)

// === SmoothDrop ===
function smoothDrop(header, body, dur = false) {
    let animDur = dur ? dur : 500
    body.style.overflow = 'hidden';
    body.style.transition = `height ${animDur}ms ease`;
    body.style['-webkit-transition'] = `height ${animDur}ms ease`;
    if (!header.classList.contains("active")) {
        header.parentNode.classList.add("active")
        body.style.display = 'block';
        let height = body.clientHeight + 'px';
        body.style.height = '0px';
        setTimeout(function () {
            body.style.height = height;
            setTimeout(() => {
                body.style.height = null
                header.classList.add("active")
            }, animDur);
        }, 0);
    } else {
        header.parentNode.classList.remove("active")
        let height = body.clientHeight + 'px';
        body.style.height = height
        setTimeout(function () {
            body.style.height = "0"
            setTimeout(() => {
                body.style.display = 'none';
                body.style.height = null
                header.classList.remove("active")
            }, animDur);
        }, 0);
    }
}

// === Page Animation ===
function animate() {
    const elements = document.querySelectorAll('[data-animation]');
    elements.forEach(async item => {
        const itemTop = item.getBoundingClientRect().top;
        const itemPoint = Math.abs(window.innerHeight - item.offsetHeight * 0.1);
        const itemScrolled = itemPoint > 100 ? itemPoint : 100;
        if (itemTop - itemScrolled < 0) {
            const animName = item.getAttribute("data-animation");
            if (preloader && !preloader.classList.contains("loaded")) {
                await new Promise(resolve => setTimeout(resolve, preloaderHiddenTimeOut));
            }
            item.classList.add(animName);
            item.removeAttribute("data-animation");
        }
    });
}