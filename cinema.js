(() => {
    "use strict";
    const hero = document.querySelector(".cinema");
    if (!hero) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const video = hero.querySelector("#cinema-video");
    const play = hero.querySelector("[data-film-play]");
    const sound = hero.querySelector("[data-film-sound]");
    const status = hero.querySelector(".cinema-status");
    const introStarted = performance.now();
    let revealTimer;
    let paused = reduced.matches,
        muted = true,
        failed = false;

    // <source>가 주석 처리되어 있으면 영상이 없는 상태 (포스터 이미지만 표시)
    const hasSource = !!(video && (video.getAttribute("src") || video.querySelector("source[src]")));

    const label = () => {
        play.textContent = paused ? "영상 재생 ↗" : "영상 일시정지 Ⅱ";
        play.setAttribute("aria-pressed", String(!paused));
        sound.textContent = muted ? "SOUND OFF" : "SOUND ON";
        sound.setAttribute("aria-pressed", String(!muted));
    };
    const tryPlay = () => {
        video.play().catch(() => {});
    };

    function reveal() {
        clearTimeout(revealTimer);
        revealTimer = setTimeout(
            () => {
                hero.classList.add("is-playing");
                status.textContent = "MARSHALL / EMBERTON III — FILM";
            },
            Math.max(0, 2600 - (performance.now() - introStarted)),
        );
    }

    function fail() {
        clearTimeout(revealTimer);
        failed = true;
        hero.classList.remove("is-playing");
        status.textContent = "영상을 불러올 수 없습니다 · YouTube에서 보기";
        paused = true;
        label();
    }

    if (hasSource) {
        video.muted = true;
        video.addEventListener("playing", reveal);
        video.addEventListener("error", fail, true); // <source> 오류는 버블링되지 않아 capture 사용
        if (!paused) tryPlay();
    } else {
        play.disabled = true;
        sound.disabled = true;
    }

    play.addEventListener("click", () => {
        if (failed) {
            window.open("https://www.youtube.com/watch?v=jkOMtjWBhpU", "_blank", "noopener");
            return;
        }
        if (!hasSource) return;
        paused = !paused;
        paused ? video.pause() : tryPlay();
        label();
    });

    sound.addEventListener("click", () => {
        if (!hasSource) return;
        muted = !muted;
        video.muted = muted;
        if (!muted) {
            paused = false;
            tryPlay();
        }
        label();
    });

    const visibility = new IntersectionObserver(
        ([entry]) => {
            if (!hasSource || failed) return;
            if (!entry.isIntersecting || document.hidden) video.pause();
            else if (!paused) tryPlay();
        },
        { threshold: 0.05 },
    );
    visibility.observe(hero);

    document.addEventListener("visibilitychange", () => {
        if (!hasSource || failed) return;
        if (document.hidden) video.pause();
        else if (!paused && hero.getBoundingClientRect().bottom > 0) tryPlay();
    });

    reduced.addEventListener("change", () => {
        if (reduced.matches) {
            paused = true;
            if (hasSource) video.pause();
            label();
        }
    });

    if (window.gsap && window.ScrollTrigger) {
        const scenes = gsap.matchMedia();
        scenes.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(".cinema-stage", {
                "--cinema-progress": 1,
                ease: "none",
                scrollTrigger: { trigger: hero, start: "top top", end: "bottom bottom", scrub: true },
            });
        });
    }
    label();
})();
