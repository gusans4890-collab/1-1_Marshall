const fs = require('node:fs');
const products = {
 'major-v': {
  title: 'Major V', lead: '매일의 이동을 가볍게 만드는 온이어 헤드폰. 긴 재생 시간과 접이식 구조에 집중한 모델입니다.',
  features: [['오래 이어지는 플레이리스트','100시간 이상의 무선 재생으로 충전 사이의 간격을 넉넉하게 가져갑니다.'],['접어서, 다음 목적지로','접이식 구조로 사용하지 않을 때 부피를 줄입니다. 이동할 때는 이어컵과 헤드밴드에 무리한 힘이 가해지지 않게 보관하세요.'],['두 가지 충전 방식','USB-C와 무선 충전을 지원해 책상과 이동 중의 충전 방식을 선택할 수 있습니다.']],
  specs: [['형태','온이어 · 접이식'],['무선 재생','100시간 이상'],['충전','USB-C · 무선 충전'],['조작','멀티 디렉션 컨트롤 노브']],
  tip: '온이어는 귀 위에 얹는 구조입니다. 헤드밴드를 좌우 균형 있게 조절하고, 오래 사용할 때는 잠시 벗어 귀를 쉬게 해주세요. 처음 연결한 뒤에는 작은 음량부터 편안한 수준으로 맞춰보세요.'
 },
 'monitor-iii-anc': {
  title:'Monitor III ANC', lead:'귀를 감싸는 오버이어 구조와 소음 제어 기능으로, 이동 중에도 음악에 집중할 수 있는 공간을 만듭니다.',
  features:[['주변 소음에서 한 걸음 멀리','액티브 노이즈 캔슬링으로 원치 않는 주변 소음을 줄여 음악에 집중하도록 돕습니다.'],['필요한 순간에는 주변 소리도','Transparency 모드로 주변 소리를 들을 수 있어 상황에 맞게 청취 방식을 전환할 수 있습니다.'],['음량에 맞춰 균형 있게','Dynamic Loudness가 음량에 따라 사운드의 균형을 조정합니다.']],
  specs:[['형태','오버이어 헤드폰'],['소음 제어','ANC · Transparency 모드'],['사운드','Dynamic Loudness'],['설정','Marshall Bluetooth 앱']],
  tip:'이어컵이 귀를 고르게 감싸도록 길이를 조절하세요. ANC와 주변 소리 모드는 환경에 맞게 바꾸고, 주변 상황을 살펴야 하는 장소에서는 소리뿐 아니라 시야도 함께 확보하세요.'
 },
 'minor-iv': {
  title:'Minor IV', lead:'작은 충전 케이스와 무선 이어버드로 구성한 일상의 음악 도구. 짧은 이동부터 긴 하루까지 간결하게 함께합니다.',
  features:[['케이스와 함께 30시간 이상','충전 케이스를 포함한 총 재생 시간은 30시간 이상입니다. 이어버드를 케이스에 넣어 다음 청취를 준비하세요.'],['가볍고 간결한 구성','헤드밴드 없이 사용하는 무선 이어버드로 가방과 주머니에 간편하게 보관할 수 있습니다.'],['일상을 위한 내수 설계','이어버드는 물에 대한 저항성을 갖춘 설계입니다. 충전 전에는 물기와 습기를 충분히 말려주세요.']],
  specs:[['형태','완전 무선 이어버드'],['총 재생 시간','케이스 포함 30시간 이상'],['구성','좌우 이어버드 · 충전 케이스'],['사운드','Marshall 시그니처 사운드']],
  tip:'케이스 포함 총 재생 시간과 이어버드 한 번 충전의 재생 시간은 다릅니다. 보관할 때 충전 접점에 이물질이 없는지 확인하고, 이어버드를 케이스에 정확히 넣어주세요.'
 },
 'emberton-iii': {
  title:'Emberton III', lead:'손에 담기는 크기에 360도 사운드를 담았습니다. 집 안의 작은 공간부터 밖으로 이어지는 하루까지 함께하는 포터블 모델입니다.',
  features:[['어느 방향에서도 음악을','True Stereophonic으로 스피커 주변에 360도 사운드를 전달합니다.'],['32시간 이상, 밖에서도','한 번 충전으로 32시간 이상의 휴대 재생을 지원합니다.'],['이동을 위한 견고함','IP67 방진·방수 설계로 먼지와 물에 대한 보호 성능을 갖췄습니다.']],
  specs:[['형태','컴팩트 포터블 스피커'],['휴대 재생','32시간 이상'],['사운드','True Stereophonic · 360도'],['보호 등급','IP67'],['추가 기능','내장 마이크 · 스피커폰']],
  tip:'평평하고 안정적인 곳에 두고 주변을 가리지 않으면 여러 방향에서 음악을 듣기 좋습니다. 물에 젖었다면 충분히 건조한 후 충전하세요. 스트랩 포함 여부는 색상과 패키지에 따라 확인하세요.'
 },
 'middleton-ii': {
  title:'Middleton II', lead:'여럿이 둘러앉는 공간과 이동하는 일상에 어울리는 포터블 스피커. 직접 조절하는 사운드와 긴 재생 시간을 함께 담았습니다.',
  features:[['자리를 바꿔도 이어지는 소리','True Stereophonic이 360도 사운드를 만들어 스피커 주변으로 음악을 전달합니다.'],['30시간 이상의 휴대 재생','하루의 이동과 긴 청취를 고려한 배터리 재생 시간을 제공합니다.'],['손끝에서 조절하는 음색','상단의 조작부와 Marshall Bluetooth 앱으로 베이스와 트레블을 조절할 수 있습니다.']],
  specs:[['형태','포터블 블루투스 스피커'],['휴대 재생','30시간 이상'],['사운드','True Stereophonic · 360도'],['보호 등급','IP67'],['조절','베이스 · 트레블']],
  tip:'실내와 실외에서는 같은 설정도 다르게 들릴 수 있습니다. 먼저 기본 음색으로 음악을 듣고 베이스와 트레블을 조금씩 조절해보세요. 벽과의 거리도 저음의 인상에 영향을 줍니다.'
 },
 'kilburn-iii': {
  title:'Kilburn III', lead:'이동용 손잡이와 클래식한 외관에 오래 이어지는 음악을 담았습니다. 자주 충전하기 어려운 긴 하루를 위한 포터블 모델입니다.',
  features:[['50시간 이상의 여유','50시간 이상의 휴대 재생으로 충전을 위한 중단을 줄입니다.'],['공간을 채우는 360도 사운드','True Stereophonic으로 어느 방향에 서 있어도 음악이 이어지도록 설계했습니다.'],['일상적인 먼지와 물 튀김에','IP54 보호 등급으로 먼지와 물 튀김에 대한 저항성을 갖췄습니다.']],
  specs:[['형태','손잡이형 포터블 스피커'],['휴대 재생','50시간 이상'],['사운드','True Stereophonic · 360도'],['보호 등급','IP54'],['음량별 균형','Dynamic Loudness']],
  tip:'손잡이로 옮긴 뒤에는 흔들리지 않는 곳에 내려놓으세요. IP54는 물속에 넣어 사용하는 등급이 아닙니다. 비와 물이 고이는 곳을 피하고, 젖었다면 건조한 뒤 충전하세요.'
 },
 'stanmore-iii': {
  title:'Stanmore III', lead:'거실과 작업 공간에 놓고 사용하는 홈 스피커. 무선 연결과 유선 입력을 함께 갖춰 공간 속 여러 음악 기기와 연결합니다.',
  features:[['넓어진 스테레오 사운드','이전 세대보다 넓어진 사운드스테이지로 집 안에서 몰입감 있는 음악을 전달합니다.'],['무선도, 유선도','Bluetooth뿐 아니라 RCA와 3.5mm 입력으로 다양한 오디오 기기를 연결할 수 있습니다.'],['공간에 맞춰 듣기','스피커를 두는 위치와 듣는 자리를 바꿔가며 방 안에서 편안한 사운드를 찾아보세요.']],
  specs:[['형태','가정용 스피커'],['무선 입력','Bluetooth'],['유선 입력','RCA · 3.5mm'],['사용 환경','전원 연결이 가능한 실내']],
  tip:'턴테이블을 연결할 때는 턴테이블의 출력과 포노 프리앰프 필요 여부를 먼저 확인하세요. RCA 입력이 있다는 것만으로 모든 턴테이블을 바로 연결할 수 있는 것은 아닙니다.'
 },
 'woburn-iii': {
  title:'Woburn III', lead:'음악 감상과 TV 사운드를 한 공간에 담는 대형 홈 스피커. 다양한 입력과 풍부한 사운드로 거실의 중심을 만듭니다.',
  features:[['거실을 위한 풍부한 소리','넓어진 스테레오 사운드스테이지로 공간을 채우는 Marshall 사운드를 전달합니다.'],['TV까지 연결하는 HDMI','HDMI 연결을 지원해 TV의 사운드 재생에도 활용할 수 있습니다.'],['작은 음량에서도 균형 있게','Dynamic Loudness가 음량에 맞춰 음색의 균형을 조정합니다.']],
  specs:[['형태','대형 가정용 스피커'],['무선 입력','Bluetooth'],['유선 입력','HDMI · RCA · 3.5mm'],['사운드','Dynamic Loudness'],['사용 환경','전원 연결이 가능한 실내']],
  tip:'TV에 연결하기 전에는 TV의 HDMI 오디오 출력 지원과 설정을 확인하세요. 음악 기기와 TV를 함께 연결했다면 현재 선택된 입력 소스를 확인한 뒤 음량을 조절하세요.'
 }
};
for (const [slug,p] of Object.entries(products)) {
 const filename=slug+'.html'; let html=fs.readFileSync(filename,'utf8');
 if(html.includes('id="product-depth"')) continue;
 const source='https://www.marshall.com/us/en/product/'+slug;
 const block=`<section class="product-deep-dive section" id="product-depth" aria-label="${p.title} 상세 가이드"><div class="depth-heading"><span class="kicker">DESIGNED FOR YOUR EVERYDAY</span><h2>More than<br><em>the details.</em></h2><p>${p.lead}</p></div><div class="depth-features">${p.features.map(([h,t],i)=>`<article class="depth-feature"><small>0${i+1} / ${p.title.toUpperCase()}</small><h3>${h}</h3><p>${t}</p></article>`).join('')}</div><div class="depth-specs"><div><span class="kicker">AT A GLANCE</span><h3>제품 한눈에 보기</h3></div><dl>${p.specs.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div><aside class="depth-tips"><span class="kicker">A BETTER LISTEN</span><h3>처음 사용할 때</h3><p>${p.tip}</p></aside><a class="depth-source" href="${source}" target="_blank" rel="noopener noreferrer">사양 출처 · Marshall 공식 제품 정보 ↗</a></section>`;
 html=html.replace(/<section class="product-gallery/,block+'<section class="product-gallery');
 html=html.replace(/(<nav class="product-nav"[^>]*>[\s\S]*?)(<a href="#gallery">)/,'$1<a href="#product-depth">상세 가이드</a>$2');
 fs.writeFileSync(filename,html);
}
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html'))) {
 let html=fs.readFileSync(file,'utf8');
 if(!html.includes('assets/favicon.svg')) html=html.replace('</head>','<link rel="icon" type="image/svg+xml" href="assets/favicon.svg"><meta name="theme-color" content="#1b1d1b"><link rel="stylesheet" href="product-depth.css"></head>');
 fs.writeFileSync(file,html);
}
