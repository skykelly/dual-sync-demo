# Step 3. Video Timeline Engine 구현

## 목표

Demo View에서 HTML5 video 기반 타임라인 엔진을 구현한다.

## 지원 기능

1. 특정 구간 재생 Trim
2. 특정 시간으로 Jump
3. 특정 시간에 Pause
4. 재생 속도 변경
5. 현재 시간 추적
6. Time Event 감지
7. Trim end 도달 시 자동 정지

## Codex 프롬프트

```text
Demo View에 Video Timeline Engine을 구현해줘.

요구사항:
1. HTML5 video element를 사용한다.
2. scenes.js의 scene.demo.videoSrc를 읽어서 영상을 표시한다.
3. scene.demo.trim.start 위치에서 재생을 시작한다.
4. scene.demo.trim.end에 도달하면 자동으로 pause한다.
5. scene.demo.playbackRate 값을 video.playbackRate에 반영한다.
6. video timeupdate 이벤트를 사용해 현재 시간을 추적한다.
7. scene.demo.timeEvents 배열을 지원한다.
8. timeEvents의 time에 도달하면 해당 이벤트를 한 번만 실행한다.
9. 이벤트 타입은 pause, syncExplain, nextScene을 우선 지원한다.
10. 실행된 timeEvent는 중복 실행되지 않도록 처리한다.
11. Controller에서 Play/Pause/Next/Prev 명령을 보내면 Demo View가 반응해야 한다.
12. Demo View는 현재 video time을 BroadcastChannel로 Controller에 주기적으로 보내야 한다.
13. 영상 로드 실패 시 fallback message를 보여준다.
```

## 메시지 예시

```js
{
  type: "VIDEO_TIME_UPDATE",
  sceneIndex: 0,
  currentTime: 7.25,
  duration: 18.0,
  isPlaying: true
}
```

## Time Event 예시

```js
timeEvents: [
  {
    id: "event-01",
    time: 3.5,
    type: "syncExplain",
    explainStepId: "explain-input"
  },
  {
    id: "event-02",
    time: 8.0,
    type: "pause"
  },
  {
    id: "event-03",
    time: 11.5,
    type: "nextScene"
  }
]
```

## 완료 기준

- Scene 진입 시 trim.start부터 영상이 시작된다.
- trim.end에 도달하면 영상이 멈춘다.
- Controller에서 Play/Pause가 동작한다.
- TimeEvent가 한 번만 실행된다.
- syncExplain 이벤트 발생 시 Explain View가 변경된다.
