# Step 6. Zoom In/Out 및 Speed Change 구현

## 목표

영상의 특정 부분을 확대/축소하고, 발표자가 영상 재생 속도를 제어할 수 있게 한다.

## Zoom 구현 방식

가장 단순하고 안정적인 방식은 video element를 감싸는 wrapper에 CSS transform을 적용하는 것이다.

```css
.video-layer {
  transform: scale(1.8);
  transform-origin: 62% 45%;
  transition: transform 0.5s ease;
}
```

## Zoom Event 데이터 구조

```js
zoomEvents: [
  {
    id: "zoom-product-card",
    time: 5,
    duration: 0.5,
    scale: 1.8,
    x: 62,
    y: 45,
    explainStepId: "explain-zoom-product-card"
  },
  {
    id: "zoom-reset",
    time: 10,
    duration: 0.5,
    scale: 1,
    x: 50,
    y: 50
  }
]
```

## Codex 프롬프트 - Zoom

```text
Demo View에 영상 Zoom In/Out 기능을 구현해줘.

요구사항:
1. scene.demo.zoomEvents 배열을 지원한다.
2. zoomEvents의 time에 도달하면 video wrapper에 CSS transform을 적용한다.
3. scale 값으로 확대/축소 비율을 제어한다.
4. x, y 값은 transform-origin 퍼센트 좌표로 사용한다.
5. duration 값은 CSS transition duration으로 적용한다.
6. zoom event에 explainStepId가 있으면 Explain View도 함께 변경한다.
7. zoom event는 timeEvent처럼 한 번만 실행되어야 한다.
8. zoom reset 기능을 제공한다.
9. Controller에서 RESET_ZOOM 명령을 보내면 scale 1로 복귀한다.
```

## Codex 프롬프트 - Speed

```text
Demo View와 Controller에 Playback Speed 제어 기능을 구현해줘.

요구사항:
1. Controller에 0.5x, 0.75x, 1x, 1.25x, 1.5x 버튼을 추가한다.
2. 버튼 클릭 시 SET_PLAYBACK_RATE 메시지를 BroadcastChannel로 보낸다.
3. Demo View는 해당 메시지를 받아 video.playbackRate를 변경한다.
4. 현재 선택된 playbackRate를 Controller에 표시한다.
5. Scene 변경 시 scene.demo.playbackRate를 기본값으로 적용한다.
6. 사용자가 Controller에서 speed를 변경하면 현재 scene 기본값보다 우선 적용한다.
```

## 완료 기준

- 영상 특정 시점에 Zoom In/Out이 자동 실행된다.
- Reset Zoom 버튼이 동작한다.
- Controller에서 재생 속도를 바꾸면 Demo View 영상 속도가 즉시 변경된다.
