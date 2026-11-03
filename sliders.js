(() => {
    "use strict";
    const motionOff = () => document.body.classList.contains("motion-paused");
    const opening = document.querySelector(".opening-swiper");
    const selection = document.querySelector(".selection-swiper");
    const state = { wantsAuto: !motionOff(), opening: null, selection: null };
    const autoButton = document.createElement("button");
    autoButton.className = "opening-play";
    autoButton.type = "button";
    function updateButton() {
        const running = !!state.opening?.autoplay?.running;
        autoButton.textContent = running ? "Ⅱ 자동 전환 정지" : "▷ 자동 전환 재생";
        autoButton.setAttribute("aria-label", running ? "하이라이트 자동 전환 정지" : "하이라이트 자동 전환 재생");
        autoButton.setAttribute("aria-pressed", String(running));
        autoButton.hidden = motionOff();
    }
    function syncMotion() {
        if (state.opening) {
            state.opening.params.speed = motionOff() ? 0 : 1100;
            const blocked = motionOff() || document.hidden || document.body.classList.contains("menu-open");
            if (blocked || !state.wantsAuto) state.opening.autoplay.stop();
            else state.opening.autoplay.start();
        }
        if (state.selection) state.selection.params.speed = motionOff() ? 0 : 700;
        updateButton();
    }
    if (window.Swiper) {
        if (opening) {
            opening
                .querySelector(".opening-controls")
                .insertBefore(autoButton, opening.querySelector(".slider-arrows"));
            state.opening = new Swiper(opening, {
                slidesPerView: 1,
                effect: "fade",
                fadeEffect: { crossFade: true },
                rewind: true,
                speed: motionOff() ? 0 : 1100,
                grabCursor: true,
                watchOverflow: true,
                autoplay: motionOff() ? false : { delay: 7000, pauseOnMouseEnter: true, disableOnInteraction: true },
                navigation: {
                    prevEl: opening.querySelector(".opening-prev"),
                    nextEl: opening.querySelector(".opening-next"),
                },
                pagination: {
                    el: opening.querySelector(".opening-pagination"),
                    clickable: true,
                    renderBullet: (i, className) =>
                        `<button class="${className}" type="button" aria-label="${i + 1}번 하이라이트">0${i + 1}</button>`,
                },
                keyboard: { enabled: true, onlyInViewport: true },
                a11y: {
                    enabled: true,
                    prevSlideMessage: "이전 하이라이트",
                    nextSlideMessage: "다음 하이라이트",
                    paginationBulletMessage: "{{index}}번 하이라이트로 이동",
                    slideLabelMessage: "{{index}} / {{slidesLength}}",
                },
                on: {
                    init(swiper) {
                        swiper.slides.forEach((slide, i) => {
                            slide.inert = i !== swiper.activeIndex;
                        });
                    },
                    slideChange(swiper) {
                        swiper.slides.forEach((slide, i) => {
                            slide.inert = i !== swiper.activeIndex;
                        });
                    },
                    autoplayStart: updateButton,
                    autoplayStop: updateButton,
                },
            });
            autoButton.addEventListener("click", () => {
                state.wantsAuto = !state.opening.autoplay.running;
                syncMotion();
            });
            opening.addEventListener("focusin", (event) => {
                if (event.target === autoButton) return;
                state.wantsAuto = false;
                state.opening.autoplay.stop();
                updateButton();
            });
        }
        if (selection) {
            state.selection = new Swiper(selection, {
                slidesPerView: "auto",
                spaceBetween: 22,
                speed: motionOff() ? 0 : 700,
                grabCursor: true,
                watchOverflow: true,
                threshold: 8,
                preventClicks: true,
                keyboard: { enabled: true, onlyInViewport: true },
                navigation: { prevEl: ".selection-prev", nextEl: ".selection-next" },
                pagination: { el: ".selection-progress", type: "progressbar" },
                breakpoints: { 701: { spaceBetween: 35 }, 1200: { spaceBetween: 50 } },
                a11y: {
                    enabled: true,
                    prevSlideMessage: "이전 제품",
                    nextSlideMessage: "다음 제품",
                    slideLabelMessage: "{{index}} / {{slidesLength}}",
                },
            });
        }
    } else {
        // Native scroll-snap keeps both carousels useful if the vendor script is unavailable.
        [opening, selection].filter(Boolean).forEach((element) => {
            const wrapper = element.querySelector(".swiper-wrapper");
            const slides = [...element.querySelectorAll(".swiper-slide")];
            let index = 0;
            const step = (delta) => {
                index = Math.max(0, Math.min(slides.length - 1, index + delta));
                wrapper.scrollTo({ left: slides[index].offsetLeft, behavior: motionOff() ? "instant" : "smooth" });
            };
            const root = element.closest("section");
            root.querySelector('[class$="-prev"]')?.addEventListener("click", () => step(-1));
            root.querySelector('[class$="-next"]')?.addEventListener("click", () => step(1));
        });
    }
    document.addEventListener("motionchange", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    new MutationObserver(syncMotion).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pagehide", () => {
        state.opening?.autoplay.stop();
    });
    syncMotion();
})();
