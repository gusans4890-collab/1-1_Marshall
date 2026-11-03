(() => {
    "use strict";
    const key = "marshall-reading-history-v1";
    let history = [];
    try { history = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
    if (!Array.isArray(history)) history = [];
    history = history.filter(item => item && /^[a-z0-9-]+\.html$/.test(item.path) && typeof item.name === "string").slice(0, 12);
    history.forEach(item => {
        if (item.section === "gallery") {
            item.section = "hero-product-image";
            item.label = "제품 사진";
        }
    });
    const path = location.pathname.split("/").pop() || "index.html";
    const save = () => { try { localStorage.setItem(key, JSON.stringify(history)); } catch {} };
    const make = (tag, text, className) => {
        const el = document.createElement(tag);
        if (text) el.textContent = text;
        if (className) el.className = className;
        return el;
    };
    const product = document.querySelector(".product-intro h1");
    if (product) {
        const old = history.find(item => item.path === path);
        const entry = { path, name: product.textContent.trim(), image: document.querySelector(".product-visual img")?.getAttribute("src") || "", section: old?.section || "", label: old?.label || "제품 소개" };
        history = [entry, ...history.filter(item => item.path !== path)].slice(0, 12);
        save();
        const sections = [...document.querySelectorAll("main section[id]")];
        let queued = false;
        const update = () => {
            queued = false;
            const current = sections.filter(section => section.getBoundingClientRect().top <= innerHeight * 0.45).at(-1);
            if (!current || entry.section === current.id) return;
            entry.section = current.id;
            const nav = [...document.querySelectorAll(".product-nav a")].find(a => a.hash === `#${current.id}`);
            entry.label = nav?.textContent.trim() || current.getAttribute("aria-label") || "상세 내용";
            save();
        };
        addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
        addEventListener("pagehide", save);
    }
    const recent = history.filter(item => item.path !== path).slice(0, 4);
    if (recent.length) {
        const section = make("section", "", "recent-products");
        section.setAttribute("aria-label", "최근 본 제품");
        section.append(make("small", "YOUR LISTENING HISTORY"), make("h2", "최근 본 제품"), make("p", "최근 살펴본 제품을 다시 만나보세요."));
        const list = make("div", "", "recent-products-list");
        recent.forEach(item => {
            const a = make("a", "", "recent-product");
            a.href = item.path;
            if (/^assets\/[a-zA-Z0-9_.-]+$/.test(item.image)) {
                const img = make("img"); img.src = item.image; img.alt = item.name; img.loading = "lazy"; a.append(img);
            }
            a.append(make("strong", item.name));
            list.append(a);
        });
        section.append(list);
        document.querySelector("main")?.append(section);
    }
})();


// Photos use drag, swipe, keyboard arrows, and discrete selection dots.
(() => {
    const frame = document.querySelector(".hero-photo-frame");
    if (!frame) return;
    const image = frame.querySelector("img");
    const counter = frame.querySelector(".hero-photo-count");
    const dots = [...frame.querySelectorAll("[data-photo-index]")];
    const photos = JSON.parse(frame.querySelector(".hero-photo-data").textContent);
    let index = 0;
    const select = next => {
        index = (next + photos.length) % photos.length;
        image.src = photos[index].src;
        image.alt = photos[index].alt;
        counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
        dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === index)));
    };
    dots.forEach((dot, i) => dot.addEventListener("click", () => select(i)));
    frame.querySelector(".photo-step-prev")?.addEventListener("click", () => select(index - 1));
    frame.querySelector(".photo-step-next")?.addEventListener("click", () => select(index + 1));
    frame.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        select(index + (event.key === "ArrowLeft" ? -1 : 1));
    });
    let start = null;
    frame.addEventListener("pointerdown", event => {
        if (event.target.closest("button") || event.button !== 0) return;
        start = { x: event.clientX, y: event.clientY };
        if (event.pointerType === "mouse") frame.setPointerCapture(event.pointerId);
        frame.classList.add("is-dragging");
    });
    frame.addEventListener("pointerup", event => {
        if (!start) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        start = null;
        frame.classList.remove("is-dragging");
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1));
    });
    const cancel = () => { start = null; frame.classList.remove("is-dragging"); };
    frame.addEventListener("pointercancel", cancel);
    frame.addEventListener("lostpointercapture", cancel);
})();

// Keep dynamically created menu labels and playback labels in the same icon family.
(() => {
    const ns = "http://www.w3.org/2000/svg";
    const icon = (external) => {
        const svg = document.createElementNS(ns, "svg");
        const attrs = { class: external ? "external-link-icon" : "link-arrow", viewBox: external ? "0 0 24 24" : "0 0 32 24", fill: "none", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false" };
        Object.entries(attrs).forEach(([key, value]) => svg.setAttribute(key, value));
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", external ? "M14 4h6v6M20 4l-9 9M10 5H5v14h14v-5" : "M3 12h25M21 5l7 7-7 7");
        svg.append(path);
        return svg;
    };
    const replaceText = text => {
        if (!text.textContent.includes("↗") || text.parentElement?.closest("script, style, textarea, svg, [contenteditable]")) return;
        const parts = text.textContent.split("↗");
        const fragment = document.createDocumentFragment();
        parts.forEach((part, index) => {
            if (index) fragment.append(icon(/^https?:\/\//.test(text.parentElement?.closest("a")?.getAttribute("href") || "")));
            if (part) fragment.append(document.createTextNode(part));
        });
        text.replaceWith(fragment);
    };
    const scan = node => {
        if (node.nodeType === Node.TEXT_NODE) { replaceText(node); return; }
        if (!(node instanceof Element) || node.closest("script, style, textarea, svg") || !node.textContent.includes("↗")) return;
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const texts = [];
        while (walker.nextNode()) texts.push(walker.currentNode);
        texts.forEach(replaceText);
    };
    scan(document.body);
    new MutationObserver(records => {
        records.forEach(record => {
            if (record.type === "characterData") scan(record.target);
            else record.addedNodes.forEach(scan);
        });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
