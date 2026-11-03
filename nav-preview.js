(() => {
    "use strict";
    const header = document.querySelector(".header");
    const nav = header?.querySelector(".desktop-nav");
    if (!nav) return;
    const enabled = matchMedia("(min-width: 701px) and (hover: hover) and (pointer: fine)");
    const pages = {
        "collection.html": [
            "THE COLLECTION",
            "An edit of sound.",
            [
                ["Major V", "On-ear headphones", "major.jpg", "major-v.html"],
                ["Emberton III", "Portable sound", "emberton-iii.jpg", "emberton-iii.html"],
                ["Woburn III", "Home listening", "woburn-iii.jpg", "woburn-iii.html"],
            ],
        ],
        "headphones.html": [
            "PERSONAL SOUND",
            "A world of your own.",
            [
                ["Major V", "Listen. Fold. Go again.", "major.jpg", "major-v.html"],
                ["Monitor III ANC", "A world of your own.", "monitor-iii.jpg", "monitor-iii-anc.html"],
            ],
        ],
        "speakers.html": [
            "SHARED SPACES",
            "Room for more sound.",
            [
                ["Emberton III", "Music, wherever you go.", "emberton-iii.jpg", "emberton-iii.html"],
                ["Stanmore III", "At home with music.", "stanmore.jpg", "stanmore-iii.html"],
                ["Kilburn III", "Take the long way.", "kilburn-iii.jpg", "kilburn-iii.html"],
            ],
        ],
        "journal.html": [
            "FIELD NOTES",
            "Beyond the object.",
            [
                ["The Old Blue Last", "London / Where it begins.", "blue-last.jpg", "story-london.html"],
                ["Badehaus", "Berlin / A place to belong.", "badehaus.jpg", "story-berlin.html"],
            ],
        ],
        "philosophy.html": [
            "OUR STORY",
            "The spirit of sound.",
            [["Our philosophy", "Culture. Craft. Character.", "amp.jpg", "philosophy.html"]],
        ],
    };
    const links = [...nav.querySelectorAll("a")];
    const panel = document.createElement("div");
    panel.id = "header-preview";
    panel.className = "header-preview";
    panel.hidden = true;
    panel.inert = true;
    panel.setAttribute("aria-label", "메뉴와 상세페이지 미리보기");
    header.append(panel);
    let current = null,
        timer;
    const node = (tag, cls, text) => {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (text) el.textContent = text;
        return el;
    };
    function close() {
        clearTimeout(timer);
        panel.hidden = true;
        panel.inert = true;
        links.forEach((link) => link.setAttribute("aria-expanded", "false"));
        current = null;
    }
    function show(link) {
        clearTimeout(timer);
        if (!enabled.matches || document.body.classList.contains("menu-open")) return;
        const data = pages[link.getAttribute("href")];
        if (!data || current === link) return;
        current = link;
        links.forEach((item) => item.setAttribute("aria-expanded", String(item === link)));
        panel.replaceChildren();
        const all = node("a", "header-preview-all", link.textContent.trim() + " 전체 보기 ↗");
        all.href = link.href;
        const grid = node("div", "header-preview-grid");
        data[2].forEach(([title, subtitle, photo, href]) => {
            const item = node("a", "header-preview-item");
            item.href = href;
            item.append(node("strong", "", title));
            grid.append(item);
        });
        panel.append(grid, all);
        const bounds = header.getBoundingClientRect();
        const anchor = link.getBoundingClientRect();
        panel.style.left = `${Math.min(Math.max(16, anchor.left - bounds.left - 18), Math.max(16, bounds.width - 256))}px`;
        panel.hidden = false;
        panel.inert = false;
    }
    links.forEach((link) => {
        link.setAttribute("aria-controls", panel.id);
        link.setAttribute("aria-expanded", "false");
        link.addEventListener("pointerenter", () => show(link));
        link.addEventListener("focus", () => show(link));
    });
    header.addEventListener("pointerenter", () => clearTimeout(timer));
    header.addEventListener("pointerleave", () => {
        timer = setTimeout(() => {
            if (!header.contains(document.activeElement)) close();
        }, 120);
    });
    header.addEventListener("focusout", (event) => {
        if (!header.contains(event.relatedTarget)) close();
    });
    header.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            const active = current;
            close();
            active?.focus();
            close();
            event.stopPropagation();
        }
    });
    document.addEventListener("pointerdown", (event) => {
        if (!header.contains(event.target)) close();
    });
    new MutationObserver(() => {
        if (document.body.classList.contains("menu-open")) close();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    enabled.addEventListener("change", close);
    window.addEventListener("pagehide", close);
    window.addEventListener("resize", close);
})();
