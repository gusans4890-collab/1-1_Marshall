(() => {
    'use strict';
    const hero = document.querySelector('.cinema');
    if (!hero) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const play = hero.querySelector('[data-film-play]');
    const sound = hero.querySelector('[data-film-sound]');
    const status = hero.querySelector('.cinema-status');
    const introStarted = performance.now();
    let revealTimer;
    function disableCaptions(target) {
        target.setOption?.('captions', 'track', {});
        target.unloadModule?.('captions');
    }
    let player, ready = false, paused = reduced.matches, muted = true, failed = false;
    const label = () => {
        play.textContent = paused ? '영상 재생 ↗' : '영상 일시정지 Ⅱ';
        play.setAttribute('aria-pressed', String(!paused));
        sound.textContent = muted ? 'SOUND OFF' : 'SOUND ON';
        sound.setAttribute('aria-pressed', String(!muted));
    };
    function load() {
        if (player || failed) return;
        if (!window.YT?.Player) return;
        player = new YT.Player('cinema-player', {
            videoId: 'jkOMtjWBhpU',
            playerVars: { autoplay: 0, controls: 0, playsinline: 1, loop: 1, playlist: 'jkOMtjWBhpU', cc_load_policy: 0, iv_load_policy: 3, rel: 0, disablekb: 1, origin: location.origin },
            events: {
                onReady(e) {
                    ready = true;
                    const iframe = e.target.getIframe();
                    iframe.title = 'Marshall — Introducing Emberton III';
                    iframe.tabIndex = -1;
                    iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
                    muted ? e.target.mute() : e.target.unMute();
                    disableCaptions(e.target);
                    if (!paused) e.target.playVideo();
                    label();
                },
                onApiChange(e) { disableCaptions(e.target); },
                onStateChange(e) {
                    if (e.data === 1) {
                        disableCaptions(e.target);
                        clearTimeout(revealTimer);
                        revealTimer = setTimeout(() => {
                            hero.classList.add('is-playing');
                            status.textContent = 'MARSHALL / EMBERTON III — FILM';
                        }, Math.max(0, 2600 - (performance.now() - introStarted)));
                    }
                },
                onError() { clearTimeout(revealTimer); failed = true; hero.classList.remove('is-playing'); status.textContent = '영상을 불러올 수 없습니다 · YouTube에서 보기'; paused = true; label(); }
            }
        });
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); load(); };
    play.addEventListener('click', () => {
        if (failed) { window.open('https://www.youtube.com/watch?v=jkOMtjWBhpU', '_blank', 'noopener'); return; }
        paused = !paused;
        if (ready) paused ? player.pauseVideo() : player.playVideo();
        else { load(); status.textContent = '영상 연결 중 · 잠시 기다려 주세요'; }
        label();
    });
    sound.addEventListener('click', () => {
        muted = !muted;
        if (ready) { muted ? player.mute() : player.unMute(); if (!muted) { paused = false; player.playVideo(); } }
        label();
    });
    const visibility = new IntersectionObserver(([entry]) => {
        if (!ready) return;
        if (!entry.isIntersecting || document.hidden) player.pauseVideo();
        else if (!paused) player.playVideo();
    }, { threshold: .05 });
    visibility.observe(hero);
    document.addEventListener('visibilitychange', () => {
        if (!ready) return;
        if (document.hidden) player.pauseVideo();
        else if (!paused && hero.getBoundingClientRect().bottom > 0) player.playVideo();
    });
    reduced.addEventListener('change', () => { if (reduced.matches) { paused = true; if (ready) player.pauseVideo(); label(); } });
    if (window.gsap && window.ScrollTrigger) {
        const scenes = gsap.matchMedia();
        scenes.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.cinema-stage', { '--cinema-progress': 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true } });
        });
    }
    label();
    if (window.YT?.Player) load();
    else { const api = document.createElement('script'); api.src = 'https://www.youtube.com/iframe_api'; api.onerror = () => { failed = true; paused = true; label(); status.textContent = '영상 연결 불가 · YouTube에서 보기'; }; document.head.append(api); }
})();
