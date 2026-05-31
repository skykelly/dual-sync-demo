# Step 7. Controller Console 강화

## 목표

Controller View를 단순 Next/Prev 버튼이 아니라 발표자 콘솔로 확장한다.

## 필요한 기능

1. Scene 목록
2. 현재 Scene 표시
3. Next / Prev
4. Play / Pause
5. Restart Scene
6. Jump to Time
7. Playback Speed 변경
8. Zoom Reset
9. Hotspot Debug On/Off
10. Explain Step 강제 변경
11. 발표자 Script 표시
12. 현재 영상 시간 표시

## UI 예시

```text
현재 Scene: 03. AI 추천 결과
현재 영상 시간: 00:07.25 / 00:18.00
현재 Explain: 제품 추천 카드 설명

[Prev] [Play/Pause] [Next]
[Restart Scene] [Reset Zoom]

Speed:
[0.5x] [0.75x] [1x] [1.25x] [1.5x]

Hotspot Debug:
[On/Off]

Explain Step:
- 기본 설명
- 입력 영역 설명
- 추천 카드 설명
- Knowledge Atlas 설명

Speaker Script:
이 장면에서는 고객 질문에서 추출된 맥락이 제품 추천 근거로 연결되는 흐름을 설명합니다.
```

## Codex 프롬프트

```text
Controller View를 발표자 콘솔 형태로 강화해줘.

요구사항:
1. scenes 배열을 읽어서 scene 목록을 표시한다.
2. 현재 scene을 강조 표시한다.
3. scene을 클릭하면 해당 scene으로 이동한다.
4. Play/Pause/Next/Prev/Restart Scene 버튼을 제공한다.
5. Playback speed 버튼을 제공하고, 선택 시 Demo View 영상 속도를 변경한다.
6. Reset Zoom 버튼을 제공한다.
7. Hotspot Debug On/Off 토글을 제공한다.
8. 현재 scene의 explain steps 목록을 표시한다.
9. explain step을 클릭하면 Explain View가 해당 step으로 변경된다.
10. 현재 scene의 script를 발표자 노트 영역에 표시한다.
11. Demo View에서 현재 video time을 주기적으로 sync로 보내면 Controller에 표시한다.
12. Controller UI는 발표 중 빠르게 조작할 수 있도록 큼직한 버튼과 명확한 상태 표시를 사용한다.
```

## 권장 메시지 모델

```js
{ type: "GO_TO_SCENE", sceneIndex: 0 }
{ type: "NEXT_SCENE" }
{ type: "PREV_SCENE" }
{ type: "PLAY" }
{ type: "PAUSE" }
{ type: "RESTART_SCENE" }
{ type: "SET_PLAYBACK_RATE", rate: 0.75 }
{ type: "RESET_ZOOM" }
{ type: "SET_HOTSPOT_DEBUG", enabled: true }
{ type: "SYNC_EXPLAIN", sceneIndex: 1, explainStepId: "explain-product-card" }
```

## 완료 기준

- Controller만 보고도 현재 발표 상태를 알 수 있다.
- Scene 목록에서 원하는 장면으로 바로 점프할 수 있다.
- Explain Step을 수동으로 바꿀 수 있다.
- Demo View의 현재 영상 시간이 Controller에 표시된다.
