const fs = require("node:fs");
const { JSDOM } = require("../.qa/node_modules/jsdom");
const products = [
    {
        slug: "major-v",
        name: "Major V",
        category: "headphones",
        kind: "ON-EAR",
        image: "major.jpg",
        note: "가볍게 접어, 매일의 가방에.",
        line: "A daily<br><em>companion.</em>",
    },
    {
        slug: "monitor-iii-anc",
        name: "Monitor III ANC",
        category: "headphones",
        kind: "OVER-EAR / ANC",
        image: "monitor-iii.jpg",
        detail: "monitor-detail.jpg",
        note: "주변의 소음에서 한 걸음 멀리.",
        line: "A world<br><em>of your own.</em>",
        intro: "오버이어 실루엣에 담긴 몰입. 노이즈 캔슬링으로 음악을 위한 개인적인 공간을 만듭니다.",
        feature: "The art of<br><em>listening.</em>",
        story: "귀를 감싸는 이어컵과 부드러운 헤드밴드. 바쁜 공간에서도 편안하게 음악을 듣고 싶은 순간을 위한 헤드폰입니다.",
        facts: [
            ["FORMAT", "오버이어 헤드폰"],
            ["LISTENING", "액티브 노이즈 캔슬링"],
            ["FINISH", "Black & Brass"],
        ],
        details: [
            [
                "음악에 집중하는 방식",
                "액티브 노이즈 캔슬링을 지원합니다. 제품의 조작과 기능 설정은 공식 설명서에서 확인하세요.",
            ],
            ["디자인", "질감 있는 외장과 골드 톤 로고, 귀를 감싸는 구조가 차분한 인상을 만듭니다."],
        ],
        url: "https://www.marshall.com/us/en/product/monitor-iii-anc?pid=1006861",
    },
    {
        slug: "minor-iv",
        name: "Minor IV",
        category: "earbuds",
        kind: "TRUE WIRELESS",
        image: "minor.jpg",
        note: "작은 케이스로 간결해지는 하루.",
        line: "Carry<br><em>less.</em>",
    },
    {
        slug: "stanmore-iii",
        name: "Stanmore III",
        category: "speakers",
        kind: "HOME AUDIO",
        image: "stanmore.jpg",
        note: "일상의 공간에 자연스럽게 놓이는 소리.",
        line: "At home<br><em>with sound.</em>",
    },
    {
        slug: "woburn-iii",
        name: "Woburn III",
        category: "speakers",
        kind: "HOME AUDIO",
        image: "woburn-iii.jpg",
        note: "공간의 중심을 만드는 존재감.",
        line: "Room<br><em>to resonate.</em>",
        intro: "넉넉한 비례와 클래식한 전면 디자인. 거실의 한편에서 음악을 듣는 자리를 새롭게 정리합니다.",
        feature: "A statement<br><em>in the room.</em>",
        story: "길게 이어지는 그릴과 골드 톤 디테일. Woburn III는 오브제처럼 놓이면서도 시선과 청취의 중심이 되는 홈 스피커입니다.",
        facts: [
            ["FORMAT", "홈 스피커"],
            ["DESIGN", "클래식 캐비닛"],
            ["FINISH", "Black"],
        ],
        details: [
            [
                "공간에서의 비례",
                "마샬 홈 스피커 컬렉션에서 큰 실루엣을 지닌 모델입니다. 설치 공간과 제품 크기는 공식 사양에서 확인하세요.",
            ],
            ["마감", "텍스처가 있는 캐비닛과 전면 그릴, 로고의 대비가 디자인을 완성합니다."],
        ],
        url: "https://www.marshall.com/us/en/product/woburn-iii?pid=1006020",
    },
    {
        slug: "emberton-iii",
        name: "Emberton III",
        category: "portable",
        kind: "COMPACT PORTABLE",
        image: "emberton-iii.jpg",
        detail: "emberton-life.jpg",
        note: "손에 담기는 크기, 바깥으로 이어지는 음악.",
        line: "Out of<br><em>the ordinary.</em>",
        intro: "작고 단단한 형태, 이동에 익숙한 디자인. 책상 위에서 들었던 음악을 다음 목적지까지 가져갑니다.",
        feature: "Made for<br><em>the detour.</em>",
        story: "가볍게 짐을 꾸리는 날을 위한 포터블 스피커. 산책이나 짧은 여행처럼, 음악을 듣는 장소를 한곳으로 정하지 않아도 됩니다.",
        facts: [
            ["PLAYTIME", "32+ hours"],
            ["PROTECTION", "IP67"],
            ["SOUND", "360° 사운드"],
        ],
        details: [
            [
                "재생 시간",
                "공식 안내 기준 32시간 이상의 휴대 재생을 지원합니다. 실제 재생 시간은 볼륨과 사용 환경에 따라 달라집니다.",
            ],
            [
                "야외에서의 사용",
                "IP67 방진·방수 등급을 갖췄습니다. 물에 관한 사용 조건과 관리 방법은 공식 설명서를 확인하세요.",
            ],
        ],
        url: "https://www.marshall.com/us/en/product/emberton-iii?pid=1006884",
    },
    {
        slug: "middleton-ii",
        name: "Middleton II",
        category: "portable",
        kind: "ALL-ROUND PORTABLE",
        image: "middleton-ii.jpg",
        detail: "middleton-life.jpg",
        note: "하루의 동선을 따라 움직이는 스피커.",
        line: "Take the<br><em>long way.</em>",
        intro: "손잡이를 잡고 출발하는 하루. 이동하기 좋은 형태에 긴 재생 시간과 직관적인 컨트롤을 담았습니다.",
        feature: "Between<br><em>destinations.</em>",
        story: "위쪽 패널의 노브를 돌려 소리를 조절하고, 스트랩을 잡아 다음 장소로 옮깁니다. 듣는 자리와 움직이는 시간이 자연스럽게 이어집니다.",
        facts: [
            ["PLAYTIME", "30+ hours"],
            ["PROTECTION", "IP67"],
            ["CONTROL", "멀티 디렉션 노브"],
        ],
        details: [
            [
                "이동 중에도",
                "공식 안내 기준 30시간 이상의 휴대 재생을 지원하며, 실제 시간은 설정과 사용 환경에 따라 달라집니다.",
            ],
            [
                "연결과 조작",
                "상단의 컨트롤과 마샬 블루투스 앱을 통해 제품을 조작할 수 있습니다. 지원 기능은 공식 제품 안내를 확인하세요.",
            ],
        ],
        url: "https://www.marshall.com/us/en/product/middleton-ii?pid=1009644",
    },
    {
        slug: "kilburn-iii",
        name: "Kilburn III",
        category: "portable",
        kind: "PORTABLE / HANDLE",
        image: "kilburn-iii.jpg",
        detail: "kilburn-life.jpg",
        note: "오래 머무는 날을 위한, 더 긴 플레이리스트.",
        line: "Stay a<br><em>little longer.</em>",
        intro: "클래식한 캐비닛과 아치형 핸들. 익숙한 마샬의 형태를 들고 다닐 수 있는 크기로 만납니다.",
        feature: "Unhurried<br><em>afternoons.</em>",
        story: "손끝으로 돌리는 볼륨·베이스·트레블 컨트롤과 넉넉한 재생 시간. 서둘러 자리를 뜨지 않아도 되는 오후에 어울립니다.",
        facts: [
            ["PLAYTIME", "50+ hours"],
            ["PROTECTION", "IP54"],
            ["CONTROL", "물리식 사운드 컨트롤"],
        ],
        details: [
            [
                "오래 듣는 음악",
                "공식 안내 기준 50시간 이상의 휴대 재생을 지원합니다. 실제 시간은 볼륨과 설정에 따라 달라집니다.",
            ],
            [
                "손끝에서 조절하기",
                "상단 컨트롤로 볼륨과 사운드를 조절합니다. 휴대를 위한 핸들이 클래식한 실루엣을 이어갑니다.",
            ],
        ],
        url: "https://www.marshall.com/us/en/product/kilburn-iii?pid=1007443",
    },
];
const groups = [
    ["headphones", "Headphones", "headphones.html", "02"],
    ["earbuds", "Earbuds", "earbuds.html", "01"],
    ["speakers", "Home speakers", "home-speakers.html", "02"],
    ["portable", "Portable speakers", "portable-speakers.html", "03"],
];
const old = new JSDOM(fs.readFileSync("index.html", "utf8")).window.document;
let header = old.querySelector(".header").outerHTML;
header = header.replace(
    /<nav class="desktop-nav"[\s\S]*?<\/nav>/,
    `<nav class="desktop-nav" aria-label="주 메뉴"><a href="collection.html">Collection</a><a href="headphones.html">Headphones</a><a href="speakers.html">Speakers</a><a href="journal.html">Journal</a><a href="philosophy.html">About</a></nav>`,
);
const menu = `<div class="menu" id="site-menu" aria-hidden="true" inert><div class="menu-top"><span>MARSHALL — AN EDIT OF SOUND</span><span>COLLECTION / CULTURE / CRAFT</span></div><div class="menu-layout"><nav class="menu-main" aria-label="전체 메뉴"><a href="collection.html" data-preview="monitor-iii.jpg"><small>01</small>Collection <span>↗</span></a><a href="journal.html" data-preview="blue-last.jpg"><small>02</small>Journal <span>↗</span></a><a href="philosophy.html" data-preview="amp.jpg"><small>03</small>Our story <span>↗</span></a><a href="support.html" data-preview="controls.jpg"><small>04</small>Support <span>↗</span></a></nav><div class="menu-side"><div class="menu-preview"><img id="menu-preview-image" src="assets/monitor-iii.jpg" alt=""></div><div class="menu-products"><span>EXPLORE BY CATEGORY</span>${groups.map((g) => `<a href="${g[2]}">${g[1]} <small>${g[3]}</small> ↗</a>`).join("")}</div></div></div><div class="menu-bottom"><a href="index.html">HOME ↗</a><a href="https://www.marshall.com/" target="_blank" rel="noreferrer">OFFICIAL MARSHALL ↗</a><span>EST. 1962 / LONDON</span></div></div>`;
const footer = fs.readFileSync(require("node:path").join(__dirname, "footer.html"), "utf8").trim();
const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500;600&family=Noto+Sans+KR:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/vendor/swiper-bundle.min.css"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="effects.css"><link rel="stylesheet" href="editorial.css"><link rel="stylesheet" href="assets/vendor/lenis.css"><link rel="stylesheet" href="motion.css"><link rel="stylesheet" href="footer.css">`;
function shell(title, content, bodyClass = "") {
    return `<!doctype html>\n<html lang="ko"><head>${head}<title>${title} — Marshall</title><meta name="description" content="헤드폰, 이어버드, 홈 스피커와 포터블 스피커를 살펴보는 마샬 컬렉션."></head><body class="${bodyClass}"><a class="skip-link" href="#main-content">본문으로 건너뛰기</a>${header}${menu}<main id="main-content">${content}</main>${footer}<script src="assets/vendor/gsap.min.js"></script><script src="assets/vendor/ScrollTrigger.min.js"></script><script src="assets/vendor/swiper-bundle.min.js"></script><script src="script.js"></script><script src="sliders.js"></script><script src="assets/vendor/lenis.min.js"></script><script src="motion.js"></script><script src="footer.js"></script></body></html>`;
}
const card = (p, i) =>
    `<a class="catalog-card reveal" data-category="${p.category}" href="${p.slug}.html"><div class="catalog-image"><img src="assets/${p.image}" alt="${p.name}" loading="lazy"></div><small>${String(i + 1).padStart(2, "0")} / ${p.kind}</small><h2>${p.name}<span>↗</span></h2><p>${p.note}</p></a>`;
const heroes = [products[1], products[7], products[4]];
const hero = `<section class="opening" aria-label="하이라이트 컬렉션"><div class="opening-heading"><span class="kicker">MARSHALL / SELECTED OBJECTS</span><h1>Sound,<br><em>considered.</em></h1><p>듣는 순간과 놓이는 공간을 생각합니다.</p></div><div class="swiper opening-swiper"><div class="swiper-wrapper">${heroes.map((p, i) => `<article class="swiper-slide opening-slide"><div class="opening-photo"><img src="assets/${p.image}" alt="${p.name}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div><div class="opening-caption"><span>${p.kind}</span><h2><a href="${p.slug}.html">${p.name} <b>↗</b></a></h2><p>${p.note}</p></div></article>`).join("")}</div><div class="opening-controls"><div class="opening-pagination" aria-label="하이라이트 선택"></div><div class="slider-arrows"><button class="opening-prev" aria-label="이전 하이라이트">←</button><button class="opening-next" aria-label="다음 하이라이트">→</button></div></div></div><div class="opening-side" aria-hidden="true">PERSONAL SOUND / SHARED SPACES</div><div class="opening-bottom"><span>A CLOSER LISTEN</span><span>01 — 08 / THE COLLECTION</span></div></section>`;
const selected = [products[0], products[2], products[5], products[6], products[3]];
const selection = `<section class="selection section"><div class="editorial-heading"><div><span class="kicker">01 / SELECTED FOR EVERYDAY</span><h2>A personal<br><em>selection.</em></h2></div><div class="selection-aside"><p>귀에 가까이, 혹은 방 한편에.<br>서로 다른 방식으로 일상에 스며드는 다섯 가지.</p><a class="text-link" href="collection.html">전체 컬렉션 <span>↗</span></a></div></div><div class="swiper selection-swiper"><div class="swiper-wrapper">${selected.map((p, i) => `<article class="swiper-slide selection-slide"><a href="${p.slug}.html"><div class="selection-image"><img src="assets/${p.image}" alt="${p.name}" loading="lazy"><span class="selection-view">VIEW OBJECT ↗</span></div><div class="selection-meta"><small>${p.kind}</small><span>0${i + 1}</span></div><h3>${p.name}</h3><p>${p.note}</p></a></article>`).join("")}</div></div><div class="selection-controls"><span class="drag-note">DRAG TO EXPLORE</span><div class="selection-progress"></div><div class="slider-arrows"><button class="selection-prev" aria-label="이전 제품">←</button><button class="selection-next" aria-label="다음 제품">→</button></div></div></section>`;
const categories = `<section class="category-edit section"><div><span class="kicker">02 / FOUR WAYS TO LISTEN</span><h2>Find your<br><em>setting.</em></h2><p>함께 움직일 소리와<br>오래 머무를 공간의 소리.</p></div><nav aria-label="컬렉션 카테고리">${groups.map((g) => `<a href="${g[2]}"><span>${g[1]}</span><small>${g[3]} OBJECTS</small><b>↗</b></a>`).join("")}</nav></section>`;
const material = `<section class="material-story"><div class="material-image"><img src="assets/grille.jpg" alt="마샬 스피커 전면 그릴의 질감" loading="lazy" data-depth></div><div class="material-copy"><span class="kicker">03 / THE LANGUAGE OF CRAFT</span><h2>Character,<br>in every<br><em>detail.</em></h2><p>직조된 그릴의 결, 손끝에 닿는 노브의 감각.<br>마샬의 디자인은 시간이 지나도 익숙한 디테일로 기억됩니다.</p><a class="text-link" href="philosophy.html">디자인과 브랜드 이야기 <span>↗</span></a></div></section>`;
const journal = `<section class="journal-preview section"><div class="editorial-heading"><div><span class="kicker">04 / FIELD NOTES</span><h2>Beyond<br><em>the object.</em></h2></div><a class="text-link" href="journal.html">저널 둘러보기 <span>↗</span></a></div><div class="journal-grid"><a class="journal-card reveal" href="story-london.html"><div><img src="assets/blue-last.jpg" alt="The Old Blue Last 공연장" loading="lazy"></div><small>LONDON / VENUES</small><h3>Where it begins. <span>↗</span></h3><p>다음 음악이 시작되는 작은 무대.</p></a><a class="journal-card reveal" href="story-berlin.html"><div><img src="assets/badehaus.jpg" alt="Badehaus 공연장" loading="lazy"></div><small>BERLIN / COMMUNITY</small><h3>A place to belong. <span>↗</span></h3><p>같은 리듬 앞에서 가까워지는 사람들.</p></a></div></section>`;
fs.writeFileSync(
    "index.html",
    shell("An Edit of Sound", hero + selection + categories + material + journal, "editorial-home"),
);
const catalogIntro = (title, copy, label) =>
    `<section class="collection-intro section"><span class="kicker">MARSHALL / ${label}</span><h1>${title}</h1><p>${copy}</p></section>`;
const filters = `<div class="catalog-filters" role="group" aria-label="제품 카테고리"><button data-filter="all" aria-pressed="true">All objects <span>08</span></button>${groups.map((g) => `<button data-filter="${g[0]}" aria-pressed="false">${g[1]}</button>`).join("")}<p class="filter-status" aria-live="polite">8개의 제품</p></div>`;
fs.writeFileSync(
    "collection.html",
    shell(
        "Collection",
        catalogIntro(
            "The listening<br><em>collection.</em>",
            "형태와 쓰임이 다른 여덟 가지 제품.<br>나에게 맞는 청취 방식을 골라보세요.",
            "EIGHT OBJECTS",
        ) +
            filters +
            `<section class="catalog section">${products.map(card).join("")}</section>`,
    ),
);
const categoryCopy = {
    headphones: [
        "A little<br><em>closer.</em>",
        "온이어의 가벼움과 오버이어의 몰입.<br>두 가지 헤드폰으로 살펴보는 개인적인 청취.",
    ],
    earbuds: ["Small<br><em>essentials.</em>", "주머니 속에 들어가는 케이스.<br>이어버드로 간결해지는 이동의 순간."],
    speakers: [
        "A place<br><em>for sound.</em>",
        "방의 크기와 놓이는 자리를 생각한 선택.<br>공간과 함께 살아가는 홈 스피커.",
    ],
    portable: ["Further<br><em>afield.</em>", "작은 가방부터 긴 주말까지.<br>서로 다른 크기의 포터블 스피커 세 가지."],
};
for (const g of groups) {
    const items = products.filter((p) => p.category === g[0]),
        c = categoryCopy[g[0]];
    fs.writeFileSync(
        g[2],
        shell(
            g[1],
            catalogIntro(c[0], c[1], g[1].toUpperCase()) +
                `<div class="category-breadcrumb"><a href="collection.html">모든 컬렉션 ↗</a><span>${items.length} OBJECTS</span></div><section class="catalog section">${items.map(card).join("")}</section>`,
        ),
    );
}
fs.writeFileSync(
    "speakers.html",
    shell(
        "Speakers",
        catalogIntro(
            "Rooms &<br><em>routes.</em>",
            "집 안에서 듣는 음악과 바깥으로 가져갈 음악.<br>두 가지 스피커 컬렉션을 살펴보세요.",
            "SPEAKERS",
        ) +
            `<section class="speaker-paths section"><a href="home-speakers.html"><img src="assets/stan-room.jpg" alt="홈 스피커 컬렉션" loading="lazy"><small>AT HOME / 02 OBJECTS</small><h2>Home speakers ↗</h2></a><a href="portable-speakers.html"><img src="assets/kilburn-life.jpg" alt="포터블 스피커 컬렉션" loading="lazy"><small>ON THE MOVE / 03 OBJECTS</small><h2>Portable speakers ↗</h2></a></section>`,
    ),
);
// Preserve existing editorial and product pages, but replace every shared shell.
for (const file of [
    "major-v.html",
    "minor-iv.html",
    "stanmore-iii.html",
    "product.html",
    "journal.html",
    "philosophy.html",
    "support.html",
    "story-london.html",
    "story-berlin.html",
]) {
    const d = new JSDOM(fs.readFileSync(file, "utf8")).window.document;
    let content = d.querySelector("main").innerHTML;
    const title = d.title.replace(" — Marshall", "");
    const lead = d.querySelector(".product-statement>p")?.textContent;
    const detail = d.querySelector(".detail-copy>p")?.textContent;
    if (lead && lead === detail) {
        const notes = {
            "major-v.html": "접히는 헤드밴드와 손끝의 컨트롤 노브. 이동과 조작을 위한 디테일을 가까이 살펴봅니다.",
            "product.html": "접히는 헤드밴드와 손끝의 컨트롤 노브. 이동과 조작을 위한 디테일을 가까이 살펴봅니다.",
            "minor-iv.html":
                "케이스에 보관하고, 꺼내어 다시 듣는 단순한 과정. 작은 이어버드에 필요한 요소를 모았습니다.",
            "stanmore-iii.html":
                "상단 패널의 노브부터 전면 그릴까지. 서로 다른 소재가 하나의 클래식한 실루엣을 이룹니다.",
        };
        content = content.replace("<p>" + detail + "</p>", "<p>" + lead + "</p>");
        const temp = new JSDOM("<main>" + content + "</main>");
        temp.window.document.querySelector(".detail-copy>p").textContent = notes[file];
        content = temp.window.document.querySelector("main").innerHTML;
        temp.window.close();
    }
    let out = shell(title, content, d.body.className);
    if (file === "product.html")
        out = out.replace(
            '<script src="script.js">',
            '<script src="legacy-product.js"></script><script src="script.js">',
        );
    fs.writeFileSync(file, out);
}
function newDetail(p) {
    const next = products[(products.indexOf(p) + 1) % products.length],
        images = p.detail ? [p.image, p.detail] : [p.image];
    return `<section class="product-hero"><div class="product-intro"><a class="breadcrumb" href="${groups.find((g) => g[0] === p.category)[2]}">COLLECTION / ${p.kind}</a><h1>${p.name}</h1><h2>${p.line}</h2><p>${p.intro}</p><a class="text-link" href="#product-story">제품 살펴보기 <span>↓</span></a></div><div class="product-visual"><img src="assets/${p.image}" alt="${p.name}"></div><span class="product-edition">MARSHALL / ${p.kind}</span></section><nav class="product-nav" aria-label="제품 상세 탐색"><strong>${p.name}</strong><a href="#product-story">특징</a><a href="#gallery">이미지</a><a href="#specifications">제품 정보</a><a href="collection.html">전체 컬렉션 ↗</a></nav><section class="product-statement section" id="product-story"><span class="kicker">01 / ${p.kind}</span><h2>${p.feature}</h2><p>${p.story}</p><div class="product-facts">${p.facts.map(([k, v]) => `<div class="reveal"><small>${k}</small><h3>${v}</h3></div>`).join("")}</div></section>${p.detail ? `<section class="detail-editorial"><div class="detail-image"><img src="assets/${p.detail}" alt="${p.name}의 디자인과 사용 모습" loading="lazy" data-depth></div><div class="detail-copy"><span class="kicker">THE DESIGN IN CONTEXT</span><h2>${p.line}</h2><p>${p.note}</p></div></section>` : ""}<section class="product-gallery section" id="gallery"><div class="section-top"><div><span class="kicker">02 / VISUAL STUDY</span><h2>A closer <em>look.</em></h2></div><p id="gallery-caption" aria-live="polite">${p.name} / Front view</p></div><button class="gallery-main" id="open-gallery" aria-label="제품 이미지 크게 보기"><img id="gallery-image" src="assets/${p.image}" alt="${p.name} / Front view" loading="lazy"><span class="gallery-zoom">크게 보기 ＋</span></button><div class="gallery-thumbs" aria-label="제품 이미지 선택">${images.map((img, i) => `<button data-gallery="${i}" aria-pressed="${i === 0}" aria-label="${p.name} / ${i ? "In context" : "Front view"}"><img src="assets/${img}" alt="" loading="lazy"><span>0${i + 1}</span></button>`).join("")}</div></section><section class="product-specs section" id="specifications"><div><span class="kicker">03 / PRODUCT NOTES</span><h2>Things<br>to <em>know.</em></h2></div><div>${p.details.map(([k, v], i) => `<details${i ? "" : " open"}><summary>${k}<span>＋</span></summary><p>${v}</p></details>`).join("")}<a class="text-link" href="${p.url}" target="_blank" rel="noreferrer">공식 제품 정보 <span>↗</span></a></div></section><a class="next-product" href="${next.slug}.html"><span class="kicker">NEXT OBJECT</span><h2>${next.name} <span>↗</span></h2><img src="assets/${next.image}" alt="${next.name}" loading="lazy"></a><dialog class="image-dialog" aria-label="제품 이미지 확대 보기"><button class="dialog-close" aria-label="확대 보기 닫기">닫기 ✕</button><button class="dialog-prev" aria-label="이전 이미지">←</button><figure><img class="dialog-image" alt=""><figcaption aria-live="polite"></figcaption></figure><button class="dialog-next" aria-label="다음 이미지">→</button></dialog>`;
}
for (const p of products.filter((p) => p.intro))
    fs.writeFileSync(p.slug + ".html", shell(p.name, newDetail(p), "product-page"));
fs.writeFileSync("assets/catalog.json", JSON.stringify(products, null, 2));
console.log("Generated 8 product collection, category pages, editorial homepage, and shared navigation.");
