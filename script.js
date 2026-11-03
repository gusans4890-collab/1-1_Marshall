(() => {
    "use strict";
    const $ = (s, r = document) => r.querySelector(s),
        $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
        fine = matchMedia("(hover:hover) and (pointer:fine)");
    const gs = window.gsap,
        ST = window.ScrollTrigger;
    let context,
        observer,
        slide = -1,
        queued = false,
        previousFocus;
    try {
        localStorage.removeItem("marshall-reduce-motion");
    } catch {}
    const off = () => reduced.matches,
        clamp = (v) => Math.min(1, Math.max(0, v));
    const menu = $(".menu"),
        toggle = $(".menu-toggle"),
        header = $(".header"),
        trigger = $(".nav-trigger"),
        panel = $(".nav-panel"),
        dropdown = $(".nav-dropdown");
    function closeDropdown() {
        if (!trigger) return;
        trigger.setAttribute("aria-expanded", "false");
        panel.inert = true;
        dropdown.classList.remove("expanded");
    }
    trigger?.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", String(open));
        panel.inert = !open;
        dropdown.classList.toggle("expanded", open);
    });
    document.addEventListener("click", (e) => {
        if (dropdown && !dropdown.contains(e.target)) closeDropdown();
    });
    dropdown?.addEventListener("focusout", (e) => {
        if (!dropdown.contains(e.relatedTarget)) closeDropdown();
    });
    function setMenu(open) {
        if (!menu || !toggle) return;
        closeDropdown();
        if (open) previousFocus = document.activeElement;
        menu.inert = !open;
        menu.setAttribute("aria-hidden", String(!open));
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "전체 메뉴 닫기" : "전체 메뉴 열기");
        document.body.classList.toggle("menu-open", open);
        menu.classList.toggle("open", open);
        $$("main,footer,.rail,.desktop-nav,.back-top").forEach((el) => (el.inert = open));
        $("a", header).inert = open;
        if (gs && !off()) {
            gs.killTweensOf(".menu-main>a");
            if (open)
                gs.fromTo(
                    ".menu-main>a",
                    { y: 45, opacity: 0, rotate: 2 },
                    {
                        y: 0,
                        opacity: 1,
                        rotate: 0,
                        duration: 0.65,
                        stagger: 0.075,
                        ease: "power3.out",
                        clearProps: "transform,opacity",
                    },
                );
        }
        if (open) $("a", menu)?.focus();
        else previousFocus?.focus();
    }
    toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    if (menu) $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (toggle?.getAttribute("aria-expanded") === "true") setMenu(false);
            if (trigger?.getAttribute("aria-expanded") === "true") {
                closeDropdown();
                trigger.focus();
            }
        }
        if (e.key === "Tab" && toggle?.getAttribute("aria-expanded") === "true") {
            const items = [toggle, ...$$("a,button", menu)],
                first = items[0],
                last = items.at(-1);
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
    const preview = $("#menu-preview-image");
    $$("[data-preview]").forEach((a) => {
        const update = () => {
            if (!preview || preview.getAttribute("src") === "assets/" + a.dataset.preview) return;
            preview.src = "assets/" + a.dataset.preview;
            if (gs && !off())
                gs.fromTo(
                    preview,
                    { opacity: 0.3, scale: 1.08 },
                    { opacity: 1, scale: 1, duration: 0.5, overwrite: true },
                );
        };
        a.addEventListener("pointerenter", update);
        a.addEventListener("focus", update);
    });
    const path = location.pathname.split("/").pop() || "index.html";
    $$(".desktop-nav a,.menu-main a,.menu-products a").forEach((a) => {
        if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page");
    });
    const slides = [
        ["Major V", "소리를 넘어, 나만의 세계로.", "major-v.html"],
        ["Minor IV", "음악과 함께, 어디든.", "minor-iv.html"],
        ["Stanmore III", "공간을 채우는 사운드.", "stanmore-iii.html"],
    ];
    const dots = $$(".dots button"),
        hero = $(".hero-scroll");
    function showSlide(i) {
        if (!dots.length || slide === i) return;
        slide = i;
        $$(".hero-image").forEach((el, n) => el.classList.toggle("is-active", n === i));
        $("#hero-name").textContent = slides[i][0];
        $("#hero-desc").textContent = slides[i][1];
        $("#current").textContent = String(i + 1).padStart(2, "0");
        $("#hero-detail").href = slides[i][2];
        $("#hero-detail").textContent = "EXPLORE " + slides[i][0].toUpperCase() + " ↗";
        dots.forEach((b, n) => {
            b.classList.toggle("active", n === i);
            b.setAttribute("aria-pressed", String(n === i));
        });
        if (gs && !off())
            gs.fromTo(
                "#hero-name,#hero-desc,#hero-detail",
                { y: 18, opacity: 0.1 },
                { y: 0, opacity: 1, duration: 0.55, stagger: 0.045, overwrite: true },
            );
    }
    dots.forEach((b, i) =>
        b.addEventListener("click", () => {
            if (hero && !off())
                window.scrollTo({
                    top: hero.offsetTop + (hero.offsetHeight - innerHeight) * ((i + 0.3) / 3),
                    behavior: "smooth",
                });
            else showSlide(i);
        }),
    );
    if (dots.length) {
        $("#hero-name").setAttribute("aria-live", "polite");
        showSlide(0);
    }
    // Product content is in separate static HTML documents, never injected here.
    const thumbs = $$("[data-gallery]"),
        gallery = $("#gallery-image"),
        dialog = $(".image-dialog");
    let galleryIndex = 0;
    if (thumbs.length < 2) $$(".dialog-prev,.dialog-next").forEach((button) => (button.hidden = true));
    function selectImage(index) {
        if (!thumbs.length) return;
        galleryIndex = (index + thumbs.length) % thumbs.length;
        const thumb = thumbs[galleryIndex];
        gallery.src = $("img", thumb).getAttribute("src");
        gallery.alt = thumb.getAttribute("aria-label");
        $("#gallery-caption").textContent = gallery.alt;
        thumbs.forEach((b, i) => b.setAttribute("aria-pressed", String(i === galleryIndex)));
        if (dialog?.open) {
            $(".dialog-image", dialog).src = gallery.src;
            $(".dialog-image", dialog).alt = gallery.alt;
            $("figcaption", dialog).textContent = `${galleryIndex + 1} / ${thumbs.length} — ${gallery.alt}`;
        } else if (gs && !off())
            gs.fromTo(
                gallery,
                { opacity: 0.4, scale: 0.97 },
                { opacity: 1, scale: 1, duration: 0.45, overwrite: true },
            );
    }
    thumbs.forEach((b, i) => b.addEventListener("click", () => selectImage(i)));
    $("#open-gallery")?.addEventListener("click", () => {
        dialog.showModal();
        document.body.classList.add("dialog-open");
        selectImage(galleryIndex);
    });
    $(".dialog-close")?.addEventListener("click", () => dialog.close());
    $(".dialog-prev")?.addEventListener("click", () => selectImage(galleryIndex - 1));
    $(".dialog-next")?.addEventListener("click", () => selectImage(galleryIndex + 1));
    dialog?.addEventListener("close", () => {
        document.body.classList.remove("dialog-open");
        $("#open-gallery")?.focus();
    });
    dialog?.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close();
    });
    dialog?.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            selectImage(galleryIndex - 1);
        }
        if (e.key === "ArrowRight") {
            e.preventDefault();
            selectImage(galleryIndex + 1);
        }
    });
    const filters = $$("[data-filter]");
    filters.forEach((button) =>
        button.addEventListener("click", () => {
            filters.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
            let count = 0;
            $$(".catalog-card").forEach((card) => {
                card.hidden = button.dataset.filter !== "all" && button.dataset.filter !== card.dataset.category;
                if (!card.hidden) {
                    count++;
                    if (gs && !off())
                        gs.fromTo(card, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, overwrite: true });
                }
            });
            $(".filter-status").textContent = `${count}개의 제품`;
            ST?.refresh();
        }),
    );
    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);
    const top = document.createElement("button");
    top.className = "back-top";
    top.setAttribute("aria-label", "맨 위로 이동");
    top.innerHTML = "<span>↑</span><small>TOP</small>";
    top.hidden = false;
    top.inert = true;
    top.setAttribute("aria-hidden", "true");
    const topDock = document.createElement("div");
    topDock.className = "back-top-dock";
    topDock.append(top);
    const siteFooter = $("footer");
    if (siteFooter) siteFooter.before(topDock);
    else document.body.append(topDock);
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: off() ? "instant" : "smooth" }));
    const cursor = document.createElement("div");
    cursor.className = "hover-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.textContent = "VIEW ↗";
    document.body.append(cursor);
    function splitWords(element, className, clipWords) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT),
            nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const frag = document.createDocumentFragment();
            node.textContent
                .split(/(\s+)/)
                .filter(Boolean)
                .forEach((word) => {
                    if (/^\s+$/.test(word)) frag.append(document.createTextNode(word));
                    else {
                        const span = document.createElement("span");
                        span.className = className;
                        span.textContent = word;
                        if (clipWords) {
                            const clip = document.createElement("span");
                            clip.className = "word-clip";
                            clip.append(span);
                            frag.append(clip);
                        } else frag.append(span);
                    }
                });
            node.replaceWith(frag);
        });
    }
    $$(
        ".editorial-heading h2,.opening-heading h1,.category-edit h2,.material-copy h2,.section-top h2,.story-copy h2,.product-statement h2,.detail-copy h2,.article-body h2,.collection-intro h1,.article-hero h1",
    ).forEach((h) => {
        h.classList.remove("reveal");
        h.classList.add("split-heading");
        splitWords(h, "word", true);
    });
    const poem = $(".scroll-poem");
    if (poem) splitWords(poem, "poem-word", false);
    function setupAnimations() {
        context?.revert();
        context = null;
        observer?.disconnect();
        cursor.classList.remove("active");
        document.body.classList.toggle("motion-paused", off());
        document.dispatchEvent(new Event("motionchange"));
        if (off()) return;
        if (!gs || !ST) {
            observer = new IntersectionObserver(
                (entries) =>
                    entries.forEach((e) => {
                        if (e.isIntersecting) {
                            e.target.classList.add("visible");
                            observer.unobserve(e.target);
                        }
                    }),
                { threshold: 0.08 },
            );
            $$(".reveal").forEach((el) => {
                el.classList.add("will-reveal");
                observer.observe(el);
            });
            return;
        }
        gs.registerPlugin(ST);
        gs.config({ nullTargetWarn: false });
        context = gs.matchMedia();
        context.add({ desktop: "(min-width:701px)", mobile: "(max-width:700px)" }, (ctx) => {
            $$(".reveal")
                .filter((el) => !el.parentElement.matches(".product-facts,.journal-grid"))
                .forEach((el, i) =>
                    gs.from(el, {
                        y: 45,
                        opacity: 0,
                        duration: 0.9,
                        delay: (i % 3) * 0.035,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 94%", once: true },
                    }),
                );
            $$(".split-heading")
                .filter((h) => !h.closest(".selection-stage"))
                .forEach((h) =>
                    gs.from($$(".word", h), {
                        yPercent: 115,
                        rotation: 4,
                        opacity: 0,
                        stagger: 0.065,
                        duration: 0.95,
                        ease: "power4.out",
                        scrollTrigger: { trigger: h, start: "top 94%", once: true },
                    }),
                );
            if (hero) {
                ST.create({
                    trigger: hero,
                    start: "top top",
                    end: "bottom bottom",
                    onUpdate: (self) => showSlide(Math.min(2, Math.floor(self.progress * 3))),
                });
                gs.to(".vertical-title", {
                    yPercent: 12,
                    ease: "none",
                    scrollTrigger: { trigger: hero, start: "top top", end: "bottom bottom", scrub: 1 },
                });
                gs.to(".hero-index b", {
                    scaleY: 0.12,
                    transformOrigin: "bottom",
                    ease: "none",
                    scrollTrigger: { trigger: hero, start: "top top", end: "bottom bottom", scrub: 0.5 },
                });
            }
            if ($(".featured")) {
                gs.fromTo(
                    ".feature-img",
                    { clipPath: "inset(12% 15% 12% 15%)", scale: 0.88 },
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        scale: 1,
                        ease: "none",
                        scrollTrigger: { trigger: ".feature-stage", start: "top 88%", end: "center 45%", scrub: 1 },
                    },
                );
                gs.to("[data-parallax]", {
                    xPercent: 15,
                    ease: "none",
                    scrollTrigger: { trigger: ".featured", start: "top bottom", end: "bottom top", scrub: 1.2 },
                });
            }
            const sound = $(".sound-scroll"),
                track = $(".sound-track");
            if (sound && ctx.conditions.desktop)
                gs.to(track, {
                    x: () => -Math.max(0, track.scrollWidth - track.clientWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: sound,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                });
            $$(".story-image img,[data-depth]").forEach((img) =>
                gs.fromTo(
                    img,
                    { yPercent: -6, scale: 1.14 },
                    {
                        yPercent: 6,
                        scale: 1.14,
                        ease: "none",
                        scrollTrigger: {
                            trigger: img.parentElement,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 0.8,
                        },
                    },
                ),
            );
            if ($(".product-visual"))
                gs.from(".product-visual", { y: 60, rotation: 3, opacity: 0, duration: 1.2, ease: "power3.out" });
            if ($(".product-word"))
                gs.to(".product-word", {
                    xPercent: -20,
                    ease: "none",
                    scrollTrigger: { trigger: ".product-hero", start: "top top", end: "bottom top", scrub: 1 },
                });
            if (poem)
                gs.fromTo(
                    ".poem-word",
                    { opacity: 0.18 },
                    {
                        opacity: 1,
                        stagger: 1,
                        ease: "none",
                        scrollTrigger: { trigger: ".manifesto", start: "top 55%", end: "bottom 75%", scrub: 0.6 },
                    },
                );
            if ($(".marquee-track")) {
                const loop = gs.to(".marquee-track", { xPercent: -50, repeat: -1, duration: 28, ease: "none" });
                ST.create({
                    trigger: ".marquee",
                    start: "top bottom",
                    end: "bottom top",
                    onToggle: (self) => loop.paused(!self.isActive),
                });
            }
            $$(".product-facts,.journal-grid").forEach((grid) =>
                gs.from([...grid.children], {
                    y: 35,
                    opacity: 0.2,
                    stagger: 0.12,
                    duration: 0.8,
                    scrollTrigger: { trigger: grid, start: "top 93%", once: true },
                }),
            );
            if ($("footer h2"))
                gs.from("footer h2", {
                    yPercent: 25,
                    opacity: 0.2,
                    duration: 1,
                    scrollTrigger: { trigger: "footer", start: "top 95%", once: true },
                });
        });
        document.fonts?.ready.then(() => ST.refresh());
    }
    reduced.addEventListener("change", () => {
        setupAnimations();
        schedule();
    });
    function update() {
        queued = false;
        progress.style.transform = `scaleX(${clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
        header?.classList.toggle("scrolled", scrollY > 50);
        const dockBounds = topDock.getBoundingClientRect();
        const showTop = dockBounds.top < innerHeight - 24;
        top.classList.toggle("is-visible", showTop);
        top.inert = !showTop;
        top.setAttribute("aria-hidden", String(!showTop));
        if (hero && !off() && (!gs || !ST))
            showSlide(
                Math.min(
                    2,
                    Math.floor(clamp(-hero.getBoundingClientRect().top / (hero.offsetHeight - innerHeight)) * 3),
                ),
            );
    }
    function schedule() {
        if (!queued) {
            queued = true;
            requestAnimationFrame(update);
        }
    }
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener(
        "load",
        () => {
            ST?.refresh();
            schedule();
        },
        { once: true },
    );
    // Batch image layout changes instead of refreshing all scenes for every image.
    let refreshFrame = 0;
    $$("img").forEach((img) => {
        if (!img.complete)
            img.addEventListener(
                "load",
                () => {
                    cancelAnimationFrame(refreshFrame);
                    refreshFrame = requestAnimationFrame(() => ST?.refresh());
                },
                { once: true },
            );
    });
    let navigating = false;
    let arrivalTimer;
    let pageScene;
    const pageCurtain = gs ? document.createElement("div") : null;
    if (pageCurtain) {
        pageCurtain.className = "page-curtain";
        pageCurtain.textContent = "MARSHALL / AN EDIT OF SOUND";
        pageCurtain.setAttribute("aria-hidden", "true");
        document.body.append(pageCurtain);
        document.body.classList.add("has-gsap-transition");
        gs.set(pageCurtain, { yPercent: 100, autoAlpha: 0 });
    }
    addEventListener("pageshow", () => {
        navigating = false;
        pageScene?.kill();
        clearTimeout(arrivalTimer);
        document.body.classList.remove("page-leaving");
        if (!off()) {
            document.body.classList.add("page-arriving");
            if (pageCurtain) {
                pageScene = gs.timeline({
                    onComplete: () => {
                        document.body.classList.remove("page-arriving");
                        gs.set(pageCurtain, { autoAlpha: 0 });
                    },
                });
                pageScene
                    .set(pageCurtain, { yPercent: 0, autoAlpha: 1 })
                    .to(pageCurtain, { yPercent: -100, duration: 0.65, ease: "power3.inOut" }, 0.06);
                const landing = $(".product-intro, .collection-intro, .article-hero");
                if (landing)
                    pageScene.fromTo(
                        landing,
                        { y: 24, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power3.out",
                            clearProps: "transform,opacity",
                        },
                        0.25,
                    );
            } else arrivalTimer = setTimeout(() => document.body.classList.remove("page-arriving"), 650);
        }
        schedule();
    });
    document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href]");
        if (
            !a ||
            e.defaultPrevented ||
            e.button !== 0 ||
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey ||
            a.target === "_blank" ||
            a.hasAttribute("download") ||
            off()
        )
            return;
        const url = new URL(a.href, location.href);
        if (
            url.origin !== location.origin ||
            !url.pathname.endsWith(".html") ||
            (url.pathname === location.pathname && url.search === location.search)
        )
            return;
        e.preventDefault();
        if (navigating) return;
        navigating = true;
        clearTimeout(arrivalTimer);
        document.body.classList.remove("page-arriving");
        document.body.classList.add("page-leaving");
        if (pageCurtain) {
            pageScene?.kill();
            pageScene = gs.timeline({ onComplete: () => location.assign(url.href) });
            pageScene
                .set(pageCurtain, { yPercent: 100, autoAlpha: 1 })
                .to(pageCurtain, { yPercent: 0, duration: 0.5, ease: "power3.inOut" })
                .to({}, { duration: 0.08 });
        } else setTimeout(() => location.assign(url.href), 500);
    });
    setupAnimations();
    update();
})();
