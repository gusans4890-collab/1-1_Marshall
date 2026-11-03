(() => {
    "use strict";

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const desktopPointer = matchMedia("(min-width: 701px) and (hover: hover) and (pointer: fine)");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const motionOff = () => reduceMotion.matches || document.body.classList.contains("motion-paused");
    let scroll = null;
    let ticker = null;
    let scenes = null;
    let destroyed = false;
    document.querySelectorAll(".opening-scroll img, .selection-scroll img").forEach((img) => {
        img.draggable = false;
    });
    document.querySelectorAll(".opening-scroll, .selection-scroll").forEach((viewport) => {
        viewport.addEventListener("dragstart", (event) => event.preventDefault());
    });

    // Animate an inner layer, preserving the existing cards, hover styles and layout.
    $$(".selection-image, .catalog-image, .journal-card > div").forEach((frame) => {
        const image = $(":scope > img", frame);
        if (!image) return;
        const layer = document.createElement("div");
        layer.className = "flow-image-layer";
        image.before(layer);
        layer.append(image);
        frame.classList.add("flow-image-frame");
    });

    function destroyScroll() {
        if (ticker) gsap.ticker.remove(ticker);
        ticker = null;
        scroll?.destroy();
        scroll = null;
    }

    function syncScrollLock() {
        if (!scroll) return;
        const blocked =
            document.body.classList.contains("entry-locked") ||
            document.body.classList.contains("menu-open") ||
            document.body.classList.contains("dialog-open") ||
            document.hidden;
        if (blocked && !scroll.isStopped) scroll.stop();
        else if (!blocked && scroll.isStopped) scroll.start();
    }

    function createScroll() {
        if (!window.Lenis || !desktopPointer.matches) return;
        scroll = new Lenis({
            lerp: 0.12,
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 1,
            anchors: false,
            // Vertical wheel input stays smooth over carousels; horizontal input stays native.
            virtualScroll: ({ event }) => !("deltaX" in event) || Math.abs(event.deltaY) >= Math.abs(event.deltaX),
            prevent: (node) => !!node.closest(".menu, dialog"),
        });
        scroll.on("scroll", ScrollTrigger.update);
        ticker = (time) => scroll?.raf(time * 1000);
        gsap.ticker.add(ticker);
        syncScrollLock();
    }

    function createScenes() {
        scenes = gsap.matchMedia();
        scenes.add(
            {
                desktop: "(min-width: 701px)",
                mobile: "(max-width: 700px)",
                roomy: "(min-width: 1001px) and (min-height: 700px)",
            },
            (context) => {
                const desktop = context.conditions.desktop;
                const scrub = desktop ? 0.65 : 0.35;
                const drift = (target, from, to, trigger, start = "top bottom", end = "bottom top") =>
                    gsap.fromTo(target, from, {
                        ...to,
                        ease: "none",
                        scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true },
                    });

                if ($(".opening-swiper")) {
                    drift(
                        ".opening-heading",
                        { y: 0, opacity: 1 },
                        { y: () => -innerHeight * (desktop ? 0.15 : 0.06), opacity: 0.25 },
                        ".opening",
                        "top top",
                        "bottom top",
                    );
                    drift(
                        ".opening-photo",
                        { yPercent: 0, scale: 1.02 },
                        { yPercent: 10, scale: 1.11 },
                        ".opening",
                        "top top",
                        "bottom top",
                    );
                    drift(".opening-side", { y: 0 }, { y: -100 }, ".opening", "top top", "bottom top");
                    drift(".opening-bottom", { opacity: 1 }, { opacity: 0 }, ".opening", "top top", "center top");
                }

                // A narrow mask opens into the existing full-width selection section.
                if (desktop && $(".selection") && !$(".selection-scroll")) {
                    drift(
                        ".selection",
                        { clipPath: "inset(0% 3.5% 0% 3.5%)" },
                        { clipPath: "inset(0% 0% 0% 0%)" },
                        ".selection",
                        "top 98%",
                        "top 24%",
                    );
                }

                $$(".editorial-heading").forEach((heading) => {
                    if (heading.closest(".selection-stage")) return;
                    drift(
                        heading,
                        { y: desktop ? 42 : 18 },
                        { y: desktop ? -26 : -8 },
                        heading.parentElement,
                        "top bottom",
                        "center top",
                    );
                });

                $$(".flow-image-layer").forEach((layer) => {
                    if (layer.closest(".selection-scroll")) return;
                    drift(
                        layer,
                        { yPercent: -3, scale: 1.09 },
                        { yPercent: 3, scale: 1.04 },
                        layer.closest(".selection-slide, .catalog-card, .journal-card"),
                        "top bottom",
                        "bottom top",
                    );
                });

                if ($(".category-edit")) {
                    drift(
                        ".category-edit > div",
                        { y: desktop ? 35 : 10 },
                        { y: desktop ? -25 : -5 },
                        ".category-edit",
                    );
                }

                if ($(".material-story")) {
                    drift(
                        ".material-image",
                        { clipPath: "inset(2% 2% 2% 2%)" },
                        { clipPath: "inset(0% 0% 0% 0%)" },
                        ".material-story",
                        "top 92%",
                        "top 20%",
                    );
                    drift(".material-copy", { y: desktop ? 16 : 8 }, { y: desktop ? -16 : -8 }, ".material-story");
                }

                if ($(".product-hero")) {
                    const heroScene = $(".product-hero-scene");
                    if (heroScene && context.conditions.roomy) {
                        heroScene.classList.add("is-held");
                        drift(
                            ".product-visual > img",
                            { scale: 1 },
                            { scale: 1.035 },
                            heroScene,
                            "top top",
                            "bottom bottom",
                        );
                    }
                }
                if ($(".article-cover")) {
                    drift(
                        ".article-cover",
                        { clipPath: "inset(4% 4% 4% 4%)" },
                        { clipPath: "inset(0% 0% 0% 0%)" },
                        ".article-cover",
                        "top 95%",
                        "top 30%",
                    );
                }
                if ($(".footer-signoff")) {
                    drift(
                        ".footer-signoff",
                        { yPercent: 25, opacity: 0.35 },
                        { yPercent: 0, opacity: 1 },
                        "footer",
                        "top bottom",
                        "center 80%",
                    );
                }

                const openingSection = $(".opening");
                if ($(".opening-scroll")) {
                    const slides = $$(".opening-slide", openingSection);
                    const scene = openingSection.closest(".opening-scene");
                    scene?.classList.add("is-scroll-driven");
                    openingSection.classList.add("is-scroll-driven");
                    gsap.set(slides, { autoAlpha: 0 });
                    gsap.set(slides[0], { autoAlpha: 1 });
                    slides.forEach((slide, i) => {
                        slide.inert = i !== 0;
                    });
                    const state = { progress: 0 };
                    const paintSlide = () => {
                        const position = Math.min(1, state.progress / 0.85) * slides.length;
                        const active = Math.min(slides.length - 1, Math.floor(position));
                        slides.forEach((slide, i) => {
                            gsap.set(slide, { autoAlpha: i === active ? 1 : 0 });
                            slide.inert = i !== active;
                        });
                        gsap.set($(".opening-photo img", slides[active]), {
                            scale: 1.045 - Math.min(1, position - active) * 0.045,
                        });
                    };
                    gsap.to(state, {
                        progress: 1,
                        ease: "none",
                        onUpdate: paintSlide,
                        scrollTrigger: {
                            id: "opening-scroll",
                            trigger: scene || openingSection,
                            start: "top top",
                            end: scene ? "bottom bottom" : () => "+=" + slides.length * innerHeight * 0.9,
                            refreshPriority: 20,
                            scrub: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });
                    paintSlide();
                }
                const productViewport = $(".selection-scroll");
                if (productViewport) {
                    const track = $(".selection-track", productViewport);
                    const stage = $(".selection-stage") || productViewport;
                    const title = $(".editorial-heading h2", stage);
                    if (title) {
                        const entrance = gsap.timeline({
                            scrollTrigger: {
                                id: "selection-title",
                                trigger: stage.closest(".selection"),
                                start: "top 88%",
                                end: "top 24%",
                                scrub: 0.55,
                                invalidateOnRefresh: true,
                            },
                        });
                        entrance
                            .fromTo(
                                $$(".word", title),
                                { yPercent: 110, rotation: 3, opacity: 0 },
                                {
                                    yPercent: 0,
                                    rotation: 0,
                                    opacity: 1,
                                    stagger: 0.13,
                                    duration: 1,
                                    ease: "power3.out",
                                },
                                0,
                            )
                            .fromTo(
                                title,
                                { "--selection-title-line": 0 },
                                { "--selection-title-line": 1, duration: 0.8, ease: "power2.out" },
                                0.6,
                            );
                    }
                    productViewport.scrollLeft = 0;
                    productViewport.classList.add("is-scroll-driven");
                    const distance = () => Math.max(0, track.scrollWidth - productViewport.clientWidth);
                    const cards = $$(".selection-slide", track);
                    const paintProductProgress = () => {
                        const progress = Math.max(
                            0,
                            Math.min(1, -Number(gsap.getProperty(track, "x")) / Math.max(1, distance())),
                        );
                        stage.style.setProperty("--selection-progress", progress);
                        const current = Math.min(cards.length - 1, Math.round(progress * (cards.length - 1)));
                        cards.forEach((card, i) => card.classList.toggle("is-current", i === current));
                        const count = $(".selection-folio-count", stage);
                        if (count && count.dataset.current !== String(current)) {
                            count.dataset.current = String(current);
                            count.innerHTML = `0${current + 1} <small>/ 0${cards.length}</small>`;
                        }
                    };
                    const section = stage.closest(".selection");
                    section.classList.add("has-product-scroll");
                    const travel = () => Math.max(1, distance()) + innerHeight * 0.35;
                    const measure = () => {
                        const style = getComputedStyle(section);
                        section.style.setProperty(
                            "--selection-scene-height",
                            `${stage.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + travel()}px`,
                        );
                    };
                    measure();
                    const setTrackX = gsap.quickSetter(track, "x", "px");
                    ScrollTrigger.create({
                        id: "product-scroll",
                        trigger: section,
                        refreshPriority: 10,
                        start: () => `top ${90 - parseFloat(getComputedStyle(section).paddingTop)}px`,
                        end: () => "+=" + travel(),
                        onRefreshInit: measure,
                        onUpdate: (self) => {
                            setTrackX(-distance() * Math.min(1, self.progress / 0.85));
                            paintProductProgress();
                        },
                    });
                    paintProductProgress();
                }
                $$(".catalog-image").forEach((image) => {
                    gsap.fromTo(
                        image,
                        { clipPath: "inset(7% 3% 7% 3%)" },
                        {
                            clipPath: "inset(0% 0% 0% 0%)",
                            ease: "none",
                            scrollTrigger: { trigger: image, start: "top 96%", end: "top 50%", scrub },
                        },
                    );
                });
                $$(".article-body > p:not(.reveal), .detail-copy > p:not(.reveal)").forEach((paragraph) => {
                    gsap.from(paragraph, {
                        y: 20,
                        opacity: 0,
                        duration: 0.85,
                        ease: "power2.out",
                        scrollTrigger: { trigger: paragraph, start: "top 94%", once: true },
                    });
                });
                $$(".depth-feature").forEach((card, index) => {
                    gsap.from(card, {
                        y: 28,
                        opacity: 0,
                        duration: 0.85,
                        delay: desktop ? index * 0.08 : 0,
                        ease: "power3.out",
                        scrollTrigger: { trigger: card, start: "top 92%", once: true },
                    });
                });
                $$(".craft-card").forEach((card) => {
                    gsap.from(card, {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: { trigger: card, start: "top 92%", once: true },
                    });
                    drift($("img", card), { scale: 1.12, yPercent: -3 }, { scale: 1, yPercent: 3 }, card);
                });
                $$(".depth-specs dl > div").forEach((row) => {
                    gsap.from(row, {
                        x: 16,
                        opacity: 0,
                        duration: 0.65,
                        ease: "power2.out",
                        scrollTrigger: { trigger: row, start: "top 94%", once: true },
                    });
                });
                if ($(".listening-room")) {
                    drift(
                        ".listening-room-photo img",
                        { scale: 1.12, yPercent: -3 },
                        { scale: 1.03, yPercent: 3 },
                        ".listening-room",
                    );
                    gsap.from(".listening-room-copy", {
                        y: 40,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: { trigger: ".listening-room", start: "top 65%", once: true },
                    });
                }
                $$(".sound-choice").forEach((choice) => {
                    gsap.from(choice, {
                        y: 24,
                        opacity: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: { trigger: choice, start: "top 92%", once: true },
                    });
                });
                return () => $(".product-hero-scene")?.classList.remove("is-held");
            },
        );
    }

    // Two speeds, one quiet visual system: an immediate point and a trailing ring.
    const pointer = document.createElement("div");
    pointer.className = "flow-pointer";
    pointer.setAttribute("aria-hidden", "true");
    pointer.innerHTML =
        '<div class="flow-pointer-dot"></div><div class="flow-pointer-trail"><i class="flow-pointer-outline"></i><span class="flow-pointer-label"></span></div>';
    document.body.append(pointer);
    const dot = $(".flow-pointer-dot", pointer);
    const trail = $(".flow-pointer-trail", pointer);
    const label = $(".flow-pointer-label", pointer);
    const dotX = gsap.quickSetter(dot, "x", "px");
    const dotY = gsap.quickSetter(dot, "y", "px");
    const trailX = gsap.quickTo(trail, "x", { duration: 0.28, ease: "power3.out" });
    const trailY = gsap.quickTo(trail, "y", { duration: 0.28, ease: "power3.out" });
    let pointerVisible = false;
    let mouseTarget = null;
    let pressed = false;
    let mouseX = 0;
    let mouseY = 0;
    let pointerFrame = false;

    function pointerAllowed() {
        return (
            !destroyed &&
            desktopPointer.matches &&
            !motionOff() &&
            !document.body.classList.contains("dialog-open") &&
            !document.hidden
        );
    }

    function hidePointer() {
        pointerVisible = false;
        pressed = false;
        pointer.classList.remove("is-visible", "is-pressed");
        if (document.body.classList.contains("cursor-enabled")) document.body.classList.remove("cursor-enabled");
    }

    function updatePointerMode(target) {
        if (!(target instanceof Element)) return;
        let mode = "idle";
        let text = "";
        if (target.closest(".menu-toggle")) {
            mode = "action";
            text = document.body.classList.contains("menu-open") ? "CLOSE" : "MENU";
        } else if (target.closest(".slider-arrows, .opening-controls, .swiper-pagination-bullet")) {
            mode = "link";
        } else if (target.closest(".opening-slide a, .selection-slide a")) {
            mode = "action";
            text = "VIEW";
        } else if (target.closest(".swiper")) {
            mode = "drag";
            text = "DRAG";
        } else if (target.closest("#open-gallery")) {
            mode = "action";
            text = "ZOOM";
        } else if (target.closest(".catalog-card, .journal-card, .speaker-paths a, .next-product")) {
            mode = "action";
            text = "VIEW";
        } else if (target.closest('a, button, summary, [role="button"]')) {
            mode = "link";
        }
        pointer.dataset.mode = mode;
        label.textContent = text;
    }

    document.addEventListener(
        "pointermove",
        (event) => {
            mouseTarget = event.target;
            if (
                !(event.target instanceof Element) ||
                event.pointerType === "touch" ||
                !pointerAllowed() ||
                event.target.closest('input, textarea, select, [contenteditable="true"]')
            ) {
                hidePointer();
                return;
            }
            mouseX = event.clientX;
            mouseY = event.clientY;
            dotX(event.clientX);
            dotY(event.clientY);
            if (!pointerVisible) {
                gsap.set(trail, { x: event.clientX, y: event.clientY });
                trailX(event.clientX, event.clientX);
                trailY(event.clientY, event.clientY);
                pointerVisible = true;
                pointer.classList.add("is-visible");
                document.body.classList.add("cursor-enabled");
            } else {
                trailX(event.clientX);
                trailY(event.clientY);
            }
            updatePointerMode(event.target);
        },
        { passive: true },
    );

    document.addEventListener(
        "pointerdown",
        (event) => {
            if (!pointerVisible || event.pointerType === "touch") return;
            pressed = true;
            pointer.classList.add("is-pressed");
        },
        { passive: true },
    );
    const release = () => {
        pressed = false;
        pointer.classList.remove("is-pressed");
    };
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("pointercancel", release, { passive: true });
    document.documentElement.addEventListener("pointerleave", hidePointer);
    window.addEventListener("blur", hidePointer);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Tab" || event.key === "Escape") hidePointer();
    });
    document.addEventListener(
        "scroll",
        () => {
            if (!pointerVisible || pressed || pointerFrame) return;
            // Keep the label in sync when a new section slides under a stationary mouse.
            pointerFrame = true;
            requestAnimationFrame(() => {
                pointerFrame = false;
                if (!pointerVisible) return;
                const target = document.elementFromPoint?.(mouseX, mouseY);
                if (target instanceof Element) {
                    mouseTarget = target;
                    updatePointerMode(target);
                } else if (mouseTarget && !mouseTarget.isConnected) hidePointer();
            });
        },
        { passive: true },
    );

    const magnetic = [];
    $$(".slider-arrows button, .menu-toggle, .round-link").forEach((button) => {
        const xTo = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });
        magnetic.push(button);
        button.addEventListener(
            "pointermove",
            (event) => {
                if (!pointerAllowed() || event.pointerType === "touch") return;
                const rect = button.getBoundingClientRect();
                xTo(Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) * 0.15)));
                yTo(Math.max(-5, Math.min(5, (event.clientY - rect.top - rect.height / 2) * 0.15)));
            },
            { passive: true },
        );
        button.addEventListener("pointerleave", () => {
            xTo(0);
            yTo(0);
        });
    });

    // Same-page details keep their original anchors, now using the same scroll clock.
    document.addEventListener(
        "click",
        (event) => {
            if (
                !scroll ||
                event.defaultPrevented ||
                event.button !== 0 ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const topButton = event.target.closest(".back-top");
            if (topButton) {
                event.preventDefault();
                event.stopImmediatePropagation();
                scroll.scrollTo(0, { duration: 1.25 });
                return;
            }
            const anchor = event.target.closest("a[href]");
            if (!anchor || anchor.classList.contains("skip-link") || anchor.target || anchor.hasAttribute("download"))
                return;
            const url = new URL(anchor.href, location.href);
            if (
                url.origin !== location.origin ||
                url.pathname !== location.pathname ||
                url.search !== location.search ||
                !url.hash
            )
                return;
            let target;
            try {
                target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
            } catch {
                return;
            }
            if (!target) return;
            event.preventDefault();
            const offset = Math.max(
                parseFloat(getComputedStyle(target).scrollMarginTop) || 0,
                parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0,
            );
            scroll.scrollTo(target, {
                offset: -offset,
                duration: 1.15,
                onComplete: () => {
                    if (location.hash !== url.hash) history.pushState(null, "", url.hash);
                },
            });
        },
        true,
    );

    $(".selection-scroll")?.addEventListener("focusin", (event) => {
        const viewport = $(".selection-scroll");
        if (!viewport.classList.contains("is-scroll-driven")) return;
        const card = event.target.closest(".selection-slide");
        const track = $(".selection-track");
        const scene = ScrollTrigger.getById("product-scroll");
        if (!card || !scene) return;
        viewport.scrollLeft = 0;
        const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (!distance) return;
        const current = -Number(gsap.getProperty(track, "x"));
        if (card.offsetLeft >= current && card.offsetLeft + card.offsetWidth <= current + viewport.clientWidth) return;
        const progress = Math.min(1, Math.max(0, card.offsetLeft / distance));
        const destination = scene.start + (scene.end - scene.start) * progress * 0.85;
        if (scroll) scroll.scrollTo(destination, { duration: 0.55 });
        else window.scrollTo({ top: destination, behavior: "smooth" });
    });

    function setup() {
        scenes?.revert();
        scenes = null;
        $(".selection-scroll")?.classList.remove("is-scroll-driven");
        $(".selection")?.classList.remove("has-product-scroll");
        $(".selection")?.style.removeProperty("--selection-scene-height");
        gsap.set(".selection-track", { clearProps: "transform" });
        $(".opening")?.classList.remove("is-scroll-driven");
        $(".opening-scene")?.classList.remove("is-scroll-driven");
        $(".product-hero-scene")?.classList.remove("is-held");
        $$(".opening-slide").forEach((slide) => {
            slide.inert = false;
        });
        destroyScroll();
        hidePointer();
        gsap.killTweensOf(magnetic);
        gsap.set(magnetic, { clearProps: "transform" });
        if (destroyed || motionOff()) return;
        createScroll();
        createScenes();
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
    }

    const bodyObserver = new MutationObserver(() => {
        syncScrollLock();
        if (!pointerAllowed()) hidePointer();
        else if (pointerVisible) updatePointerMode(mouseTarget);
    });
    // Observe only the body class. Cursor state lives on its own node, avoiding loops.
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("motionchange", setup);
    document.addEventListener("entryunlock", () => {
        syncScrollLock();
        ScrollTrigger.refresh();
    });
    desktopPointer.addEventListener("change", setup);
    document.addEventListener("visibilitychange", () => {
        syncScrollLock();
        if (document.hidden) hidePointer();
    });
    window.addEventListener("pagehide", () => {
        destroyed = true;
        scenes?.revert();
        scenes = null;
        destroyScroll();
        hidePointer();
    });
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            destroyed = false;
            setup();
        }
    });
    setup();
})();
