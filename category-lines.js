(() => {
    "use strict";
    const section = document.querySelector(".category-edit");
    if (!section) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const rows = [...section.querySelectorAll("nav a")].map((link) => {
        const line = document.createElement("i");
        line.className = "flow-rule";
        line.setAttribute("aria-hidden", "true");
        link.append(line);
        return { link, line };
    });
    let frame = 0;
    function update() {
        frame = 0;
        section.classList.toggle("flow-lines-active", !reduced.matches);
        const height = window.innerHeight;
        rows.forEach(({ link, line }) => {
            const top = link.getBoundingClientRect().top;
            const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (height * 0.9 - top) / (height * 0.65)));
            line.style.transform = `scaleX(${progress})`;
        });
    }
    function schedule() {
        if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    reduced.addEventListener("change", schedule);
    update();
})();
