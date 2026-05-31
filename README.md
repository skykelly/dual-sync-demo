# Dual Sync Presentation Sample

같은 PC의 브라우저 창/탭을 동기화하는 듀얼 모니터용 HTML 프리젠테이션 예시입니다.

## 실행 방법

### 발표용 단일 HTML

1. 아래 명령으로 발표용 번들을 만듭니다.

   ```sh
   node scripts/build-single-html.mjs
   ```

2. `dist/index.html`을 브라우저에서 직접 엽니다.
3. Controller 화면에서 아래 링크를 각각 새 창으로 엽니다.
   - `dist/index.html?view=demo`
   - `dist/index.html?view=explain`
4. Demo View 창을 첫 번째 모니터로 이동합니다.
5. Explain View 창을 두 번째 모니터로 이동합니다.
6. Controller 화면에서 `Next`, `Prev`, `Play`, `Reset Timer`를 조작합니다.

`dist/index.html`에는 CSS, JavaScript, scene data가 인라인으로 포함됩니다. `data/scenes.js`에서 참조하는 실제 미디어 파일이 프로젝트에 있으면 같은 경로로 `dist/assets/...`에 복사됩니다.

### 개발용 모듈 실행

개발 중에는 정적 서버로 루트 `index.html`을 실행합니다.

```sh
python3 -m http.server 4173
```

그 다음 브라우저에서 `http://127.0.0.1:4173/index.html?view=controller`를 엽니다.

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

- 발표 장면 데이터: `data/scenes.js`
- Authoring 영상 목록: `data/videos.js`
- 화면 동기화 로직: `src/app.js`
- 디자인: `styles/styles.css`
- 발표용 단일 HTML 생성: `scripts/build-single-html.mjs`

## Scene 편집 흐름

`data/scenes.js`는 발표 동작을 결정하는 핵심 파일입니다. 직접 처음부터 작성하기보다 Authoring View에서 편집점을 찍고 생성된 JSON을 붙여넣는 방식이 효율적입니다.

1. `assets/videos/`에 영상을 넣습니다.
2. `data/videos.js`에 영상 경로를 추가합니다.
3. 개발 서버에서 `index.html?view=author`를 엽니다.
4. 영상을 선택하고 `Load`를 누릅니다.
5. 영상 재생 중 `Set Start`, `Set End`로 scene trim 구간을 잡습니다.
6. Scene title/description과 Explain Step을 작성합니다.
7. 현재 time 기준으로 Time Event, Hotspot, Zoom Event를 추가합니다.
8. `Generated Scene Entry`를 복사해 `data/scenes.js`의 `scenes` 배열에 붙여넣습니다.
9. `node scripts/build-single-html.mjs`를 다시 실행해 발표용 `dist/index.html`을 갱신합니다.

## 파일 역할

### 실행 파일

- `index.html`: 개발용 진입점입니다. `src/app.js`를 ES module로 로드하므로 정적 서버에서 실행합니다.
- `dist/index.html`: 발표용 단일 HTML 번들입니다. `node scripts/build-single-html.mjs`로 생성하며, 브라우저에서 직접 열 수 있습니다.

### 데이터

- `data/scenes.js`: 발표 scene 정의 파일입니다. 각 scene의 영상 경로, trim 구간, time event, hotspot, zoom event, explain step을 선언합니다.
- `data/videos.js`: Authoring View에서 선택할 영상 manifest입니다. static HTML은 폴더 목록을 직접 읽을 수 없으므로 새 영상을 추가하면 이 파일에 경로를 등록합니다.

### 앱 로직

- `src/app.js`: URL의 `view` 값을 읽어 Controller, Demo, Explain, Author View를 선택하고 전체 이벤트 흐름을 연결합니다.
- `src/state.js`: 현재 scene, explain step, 재생 상태, 타이머, playback rate, hotspot debug 상태를 관리합니다.
- `src/sync.js`: `BroadcastChannel` 기반 창/탭 간 메시지 송수신을 담당합니다.
- `src/videoEngine.js`: Demo View의 HTML5 video timeline을 제어합니다. trim seek, play/pause, time event, hotspot action, zoom, playback speed를 처리합니다.

### View 렌더링

- `src/controllerView.js`: 발표자 Controller 콘솔을 렌더링합니다. scene 이동, play/pause, jump, speed, zoom reset, hotspot debug, explain step 선택 UI를 포함합니다.
- `src/demoView.js`: 시연 화면을 렌더링합니다. 영상 프레임, fallback message, hotspot layer, timeline summary를 표시합니다.
- `src/explainView.js`: 설명 화면을 렌더링합니다. 현재 scene의 active explain step 내용을 표시합니다.
- `src/authorView.js`: Authoring MVP 화면을 렌더링하고 동작을 연결합니다. 영상 클릭 좌표, hotspot, time event, zoom event JSON 생성을 지원합니다.
- `src/viewShell.js`: 모든 View가 공유하는 상단바, 진행률, 타이머 표시 shell을 렌더링합니다.

### 스타일과 빌드

- `styles/styles.css`: 전체 화면, Controller, Demo, Explain, Authoring UI 스타일을 정의합니다.
- `scripts/build-single-html.mjs`: 개발용 모듈 파일과 CSS를 읽어 `dist/index.html` 단일 파일로 번들링합니다. scene에서 참조하는 `assets/...` 파일이 있으면 `dist/assets/...`로 복사합니다.
- `scripts/run-codex-*.sh`: 단계별 Codex 작업 자동 실행 보조 스크립트입니다. 발표 앱 실행에는 필요하지 않습니다.

### 진행 기록과 계획

- `docs/codex-plan/`: 단계별 구현 계획과 테스트 체크리스트가 들어 있습니다.
- `progress/codex-progress.md`: 각 단계의 완료 내용, 검증 결과, 남은 수동 테스트 항목을 기록합니다.

## 동기화 방식

브라우저의 `BroadcastChannel` API를 사용합니다. 같은 브라우저 프로필에서 열린 창/탭 사이에서 동작합니다.
서버가 없기 때문에 서로 다른 PC 간 동기화에는 적합하지 않습니다.
# dual-sync-demo
