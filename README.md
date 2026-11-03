# Marshall — An Edit of Sound

`index.html`을 VS Code Live Server 또는 브라우저에서 여세요. 설치나 빌드는 필요하지 않습니다.

## 이번 구성

- 메인: 3개 하이라이트의 페이드 스와이퍼와 5개 제품의 드래그·터치 스와이퍼
- 8개 제품: Major V, Monitor III ANC, Minor IV, Stanmore III, Woburn III, Emberton III, Middleton II, Kilburn III
- 각 제품은 같은 이름의 독립된 HTML 상세페이지
- 컬렉션: `collection.html`에서 8개 제품 카테고리 필터
- 카테고리: `headphones.html`, `earbuds.html`, `home-speakers.html`, `portable-speakers.html`
- 스피커 분류: `speakers.html`
- 저널 및 글: `journal.html`, `story-london.html`, `story-berlin.html`
- 브랜드 및 지원: `philosophy.html`, `support.html`

헤더 메뉴는 페이지 내 스크롤이나 드롭다운이 아닌 별도 HTML 문서로 이동합니다. 상세페이지 안의 제품 정보 탭은 해당 상세 문서 안에서 작동합니다. 예전 `product.html?model=...` 주소도 새 상세 주소로 연결됩니다.

## 인터랙션과 스타일

`editorial.css`에서 Cormorant Garamond·Manrope·Noto Sans KR 조합, 얇은 구분선, 차분한 대비와 여백을 정의합니다. 기존 마키와 반복 선언문을 없애고 선택 제품, 카테고리 안내, 소재 이야기, 저널로 내용을 구분했습니다.

GSAP 3.14.2·ScrollTrigger와 Swiper 12.0.3은 `assets/vendor/`의 로컬 파일을 사용합니다. Google Fonts는 연결 실패 시 기본 글꼴로 표시됩니다.

- 스와이퍼: 터치·마우스 드래그, 이전·다음, 번호 페이지네이션, 진행선, 키보드 조작
- 하이라이트 자동 전환: 7초 간격, 정지·재생 버튼, 키보드 포커스와 메뉴 열기 시 정지
- GSAP: 단어별 등장, 이미지 패럴랙스, 카드 순차 등장
- 상세: 갤러리 선택, 확대 다이얼로그, 방향키·Escape, 펼침 정보
- 전체 메뉴 포커스 제한, 모션 줄이기 설정 저장, 페이지 전환, 맨 위로 버튼

제품 사진은 공식 제품 페이지에서 내려받았습니다. 추가 사진 출처는 `assets/catalog-sources.json`, 기존 출처는 `assets/photo-sources.json`에 있습니다.

## 개발 검증

```
npm.cmd install --prefix .qa --no-audit --no-fund jsdom@26.1.0
node tests/interactions.cjs
```

21개 문서의 데스크톱·모바일 조건에서 메뉴, 필터, 갤러리, GSAP, Swiper 전환과 자동재생, 동작 줄이기, 라이브러리 대체 동작을 DOM 기반으로 검사합니다. 실제 렌더링 검사는 브라우저 도구의 현재 URL 확인 오류로 완료하지 못했습니다.

`scripts/redesign.cjs`는 컬렉션 데이터와 공유 레이아웃을 포함한 개발용 생성 스크립트입니다. 실행에는 위의 개발용 jsdom이 필요합니다. 사이트 이용에는 필요하지 않습니다.

참고: https://earcouture.jp/
비공식 마샬 디자인 스터디입니다. 이미지와 로고의 권리는 각 권리자에게 있습니다.

## 흐르는 스크롤과 커서

기존 화면 구성 위에 `motion.js`와 `motion.css`를 적용했습니다. Lenis 1.3.17도 로컬에서 불러옵니다.

- 데스크톱 휠 입력을 GSAP 타이밍에 맞춘 관성 스크롤로 연결합니다. 모바일 터치 스크롤은 기본 동작을 유지합니다.
- 첫 화면의 제목과 이미지가 다른 속도로 이동하고, 선택 제품 섹션의 마스크가 넓어집니다.
- 제품·저널 이미지는 독립된 내부 레이어로 패럴랙스를 적용해 기존 카드 배치와 호버 동작을 유지합니다.
- 소재 이미지의 마스크, 카테고리 구분선, 제목과 푸터에 스크롤 연동 움직임을 더했습니다.
- 데스크톱 커서는 즉시 움직이는 작은 점과 뒤따르는 얇은 링으로 표시됩니다. 스와이퍼는 DRAG, 카드 VIEW, 갤러리 ZOOM, 메뉴 MENU/CLOSE 상태로 반응합니다.
- 화살표와 메뉴 버튼은 최대 5px 안에서 마우스를 따라 움직입니다.
- 키보드 사용, 터치 입력, 확대 다이얼로그, 모션 줄이기에서는 기본 커서를 사용합니다. 메뉴·다이얼로그에서는 배경 관성 스크롤을 멈춥니다.

자동 검사에는 데스크톱 관성 스크롤 활성화, 스와이퍼 위의 세로 휠 입력, 커서 상태와 키보드 전환, 모션 해제 시 ScrollTrigger·Lenis 정리가 포함되어 있습니다. 화면을 직접 렌더링한 시각 검증은 포함하지 않습니다.

## ?? ???? ??? ??? ??

?? ?? ?? ???(https://www.marshall.com/kr/ko)? ????, 4? ?? ??, ?? ??? ?? ??? ??????.

- PC 1024px ??: ???? 2?? ?? 4?? ?? ??
- ??? 701?1023px: ?? 2?? ?? ??
- ??? 700px ??: ???? ?? ??, ? ??? ??? ?? ????, ?? ?? 2?

?? ?? ??? scripts/footer.html, ???? footer.css, ???? ??? footer.js? ????. ???? ???????????? ?? ?? ?? ???? ?????.

???? ??? ???? ??? ?? ?? ??? ??????. ????? ?? ??? ??? ???? ?????.
