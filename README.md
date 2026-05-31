# Dual Sync Presentation Sample

서버 없이 같은 PC의 브라우저 창/탭을 동기화하는 듀얼 모니터용 HTML 프리젠테이션 예시입니다.

## 실행 방법

1. `index.html`을 브라우저에서 엽니다.
2. Controller 화면에서 아래 링크를 각각 새 창으로 엽니다.
   - `index.html?view=demo`
   - `index.html?view=explain`
3. Demo View 창을 첫 번째 모니터로 이동합니다.
4. Explain View 창을 두 번째 모니터로 이동합니다.
5. Controller 화면에서 `Next`, `Prev`, `Play`, `Reset Timer`를 조작합니다.

## URL 모드

- `index.html?view=controller` : 발표자 컨트롤러
- `index.html?view=demo` : 시연 화면
- `index.html?view=explain` : 설명 화면

## 키보드 단축키

- 오른쪽 화살표 / Space / PageDown: 다음 장면
- 왼쪽 화살표 / PageUp: 이전 장면
- P: 타이머 재생/정지
- R: 타이머 리셋

## 수정 포인트

- 발표 장면 데이터: `scenes.js`
- 화면 동기화 로직: `app.js`
- 디자인: `styles.css`

## 동기화 방식

브라우저의 `BroadcastChannel` API를 사용합니다. 같은 브라우저 프로필에서 열린 창/탭 사이에서 동작합니다.
서버가 없기 때문에 서로 다른 PC 간 동기화에는 적합하지 않습니다.
# dual-sync-demo
