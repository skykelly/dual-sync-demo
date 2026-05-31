# Dual Sync Interactive Demo Presentation - Codex 개발 계획

## 1. 프로젝트 목표

HTML 기반 듀얼 모니터 프리젠테이션 시스템을 개발한다.

Demo View에서는 ProtoPie와 유사한 영상 기반 인터랙티브 시연을 실행하고, Explain View에서는 Demo View의 현재 장면, 영상 시간, 클릭 포인트, Zoom 이벤트와 동기화되어 설명 슬라이드가 자동으로 변경되어야 한다.

초기 목표는 완전한 ProtoPie 대체가 아니라, 다음 목적에 특화된 경량 Presentation Engine이다.

> 시연 영상 + 인터랙션 포인트 + 설명 동기화를 결합한 경영진 보고/컨퍼런스 데모용 HTML Presentation Engine

## 2. 핵심 사용자 시나리오

발표자는 Controller View를 사용한다.

- Demo View는 첫 번째 모니터에 띄운다.
- Explain View는 두 번째 모니터에 띄운다.
- Controller View에서 Next, Prev, Play, Pause, Speed, Zoom Reset, Explain Step 변경을 제어한다.
- Demo View에서 영상의 특정 시점 또는 Hotspot 클릭이 발생하면 Explain View가 자동으로 변경된다.

## 3. 실행 URL 구조

```text
index.html?view=controller
index.html?view=demo
index.html?view=explain
```

후속 단계에서 아래 모드를 추가할 수 있다.

```text
index.html?view=author
```

## 4. 기술 조건

- 서버 없이 로컬 HTML 파일로 실행 가능해야 한다.
- 같은 PC의 여러 브라우저 창 간 동기화는 BroadcastChannel API를 사용한다.
- 외부 프레임워크 없이 Vanilla JavaScript로 우선 구현한다.
- 데이터는 `data/scenes.js`에서 관리한다.
- 모든 좌표는 픽셀이 아니라 퍼센트 기준으로 관리한다.
- 발표 중 안정성이 중요하므로 자동 진행보다 수동 제어를 우선한다.

## 5. 최종 폴더 구조

```text
dual-sync-demo/
├── index.html
├── README.md
├── data/
│   └── scenes.js
├── src/
│   ├── app.js
│   ├── sync.js
│   ├── state.js
│   ├── controllerView.js
│   ├── demoView.js
│   ├── explainView.js
│   └── videoEngine.js
├── styles/
│   └── styles.css
└── assets/
    └── videos/
```

## 6. 핵심 기능 목록

1. Dual Sync 유지
2. Scene Data Model 확장
3. Video Timeline Engine
4. Trim start/end
5. Playback speed 변경
6. Time Event 처리
7. Hotspot Interaction
8. Zoom In/Out
9. Explain View Step Sync
10. Controller Console 강화
11. Authoring Mode MVP 추가

## 7. 개발 순서

```text
Step 1. 프로젝트 구조 리팩토링
Step 2. scenes.js 데이터 모델 확장
Step 3. Video Timeline Engine 구현
Step 4. Explain View를 step 기반으로 변경
Step 5. TimeEvent → Explain Sync 구현
Step 6. Hotspot 구현
Step 7. Zoom Event 구현
Step 8. Playback Speed 제어 구현
Step 9. Controller 고도화
Step 10. 샘플 Demo Scenario 작성
Step 11. Authoring Mode MVP 추가
```

## 8. MVP 범위

초기 MVP는 아래 기능까지만 포함한다.

- Dual Sync
- Demo View 영상 재생
- Scene별 Trim start/end
- Play / Pause / Next / Prev
- TimeEvent 기반 Explain View 자동 변경
- Hotspot 클릭 시 Explain View 변경
- Zoom Event 기반 영상 확대
- Playback Speed 변경

초기 MVP에서 제외해도 되는 것:

- Drag & Drop 기반 완성형 편집기
- 멀티 디바이스 WebSocket 동기화
- 복잡한 ProtoPie 수준의 상태머신
- 클라우드 저장
- 사용자 계정/권한
