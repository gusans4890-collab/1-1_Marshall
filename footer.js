(() => {
    "use strict";
    const footer = document.querySelector(".brand-footer");
    if (!footer) return;
    const groups = [...footer.querySelectorAll(".footer-group")];
    const mobile = matchMedia("(max-width: 700px)");
    let expanded = null;

    function render() {
        groups.forEach((group) => {
            const summary = group.querySelector("summary");
            const open = !mobile.matches || expanded === group;
            if (!open && group.contains(document.activeElement) && document.activeElement !== summary) summary.focus();
            group.open = open;
            summary.tabIndex = mobile.matches ? 0 : -1;
            summary.setAttribute("aria-expanded", String(open));
        });
    }

    groups.forEach((group) => {
        const summary = group.querySelector("summary");
        summary.addEventListener("click", (event) => {
            event.preventDefault();
            if (!mobile.matches) return;
            expanded = group.open ? null : group;
            render();
        });
    });
    mobile.addEventListener("change", render);
    render();
})();
