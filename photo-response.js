(() => {
    "use strict";
    const enabled = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const frames = [
        ...document.querySelectorAll(
            ".selection-image, .catalog-image, .journal-card > div, .craft-card > div, .product-visual, .detail-image, .gallery-main, .sound-choice-photo",
        ),
    ];
    const resetters = [];
    frames.forEach((frame) => {
        if (frame.closest(".product-page") && frame.matches(".product-visual, .detail-image, .gallery-main")) return;
        frame.classList.add("photo-response");
        let raf = 0,
            x = 0,
            y = 0;
        const reset = () => {
            cancelAnimationFrame(raf);
            raf = 0;
            frame.classList.remove("photo-engaged");
            [
                "--photo-x",
                "--photo-y",
                "--photo-angle",
                "--photo-axis-x",
                "--photo-axis-y",
                "--photo-light-x",
                "--photo-light-y",
            ].forEach((name) => frame.style.removeProperty(name));
        };
        resetters.push(reset);
        frame.addEventListener(
            "pointermove",
            (event) => {
                if (!enabled.matches || event.pointerType === "touch") return;
                const box = frame.getBoundingClientRect();
                x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / Math.max(1, box.width)) * 2 - 1));
                y = Math.max(-1, Math.min(1, ((event.clientY - box.top) / Math.max(1, box.height)) * 2 - 1));
                if (raf) return;
                raf = requestAnimationFrame(() => {
                    raf = 0;
                    frame.classList.add("photo-engaged");
                    frame.style.setProperty("--photo-x", `${x * 3}px`);
                    frame.style.setProperty("--photo-y", `${y * 3}px`);
                    frame.style.setProperty("--photo-axis-x", -y);
                    frame.style.setProperty("--photo-axis-y", x || 0.001);
                    frame.style.setProperty("--photo-angle", `${Math.hypot(x, y) * 1.3}deg`);
                    frame.style.setProperty("--photo-light-x", `${(x + 1) * 50}%`);
                    frame.style.setProperty("--photo-light-y", `${(y + 1) * 50}%`);
                });
            },
            { passive: true },
        );
        frame.addEventListener("pointerleave", reset);
        frame.addEventListener("pointercancel", reset);
        frame.addEventListener("focusout", reset);
    });
    enabled.addEventListener("change", () => resetters.forEach((reset) => reset()));
    window.addEventListener("blur", () => resetters.forEach((reset) => reset()));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Tab") resetters.forEach((reset) => reset());
    });
})();
