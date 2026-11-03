(() => {
    "use strict";
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("entry-locked");
    body.classList.add("entry-locked");
    const block = (event) => event.preventDefault();
    const touch = (event) => {
        if (event.touches.length === 1) event.preventDefault();
    };
    const keys = (event) => {
        if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        if (
            ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End", " "].includes(
                event.key,
            )
        )
            event.preventDefault();
    };
    const options = { capture: true, passive: false };
    window.addEventListener("wheel", block, options);
    window.addEventListener("touchmove", touch, options);
    document.addEventListener("dragstart", block, true);
    document.addEventListener("keydown", keys, true);
    let timer;
    function unlock() {
        clearTimeout(timer);
        root.classList.remove("entry-locked");
        body.classList.remove("entry-locked");
        window.removeEventListener("wheel", block, true);
        window.removeEventListener("touchmove", touch, true);
        document.removeEventListener("dragstart", block, true);
        document.removeEventListener("keydown", keys, true);
        document.dispatchEvent(new Event("entryunlock"));
    }
    timer = setTimeout(unlock, 3000);
    window.addEventListener("pagehide", unlock, { once: true });
})();
