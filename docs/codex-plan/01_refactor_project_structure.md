# Step 1. 프로젝트 구조 리팩토링

## 목표

기존 단일 HTML/JS 구조를 확장 가능한 모듈 구조로 리팩토링한다. 기존 BroadcastChannel 기반 동기화는 유지한다.

## 작업 범위

기존 파일이 다음처럼 구성되어 있다고 가정한다.

```text
index.html
scenes.js
app.js
styles.css
assets/
```

이를 다음 구조로 변경한다.

```text
index.html
README.md
data/scenes.js
src/app.js
src/sync.js
src/state.js
src/controllerView.js
src/demoView.js
src/explainView.js
src/videoEngine.js
styles/styles.css
assets/videos/
```

## Codex 프롬프트

```text
현재 dual sync HTML 프로젝트를 확장 가능한 구조로 리팩토링해줘.

요구사항:
1. 기존 BroadcastChannel 기반 동기화는 유지한다.
2. scenes.js를 data/scenes.js로 분리한다.
3. view=controller, view=demo, view=explain 모드별 렌더링 파일을 src/controllerView.js, src/demoView.js, src/explainView.js로 분리한다.
4. 모든 상태는 src/state.js에서 관리한다.
5. sync 메시지 송수신은 src/sync.js로 분리한다.
6. 영상 제어 관련 함수는 src/videoEngine.js로 분리할 준비를 한다.
7. 기존 기능이 깨지지 않도록 한다.
8. 서버 없이 index.html을 로컬에서 열어도 동작해야 한다.
9. ES module을 사용한다.
10. index.html에서는 src/app.js만 로드한다.
```

## 구현 힌트

`index.html`에는 아래처럼 module script를 사용한다.

```html
<script type="module" src="./src/app.js"></script>
```

`src/app.js`는 URL 파라미터를 읽고 모드별 렌더링 함수를 호출한다.

```js
const params = new URLSearchParams(window.location.search);
const view = params.get("view") || "controller";
```

## 완료 기준

- `index.html?view=controller`가 정상 렌더링된다.
- `index.html?view=demo`가 정상 렌더링된다.
- `index.html?view=explain`이 정상 렌더링된다.
- Controller에서 Next/Prev를 누르면 Demo View와 Explain View가 함께 변경된다.
- 브라우저 콘솔에 module import 오류가 없어야 한다.
