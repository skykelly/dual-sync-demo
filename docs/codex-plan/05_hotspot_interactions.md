# Step 5. Hotspot Interaction 구현

## 목표

Demo View 영상 위에 특정 시간 구간 동안 클릭 가능한 Hotspot을 표시하고, 클릭 시 액션을 실행한다.

## Hotspot 개념

Hotspot은 영상 위에 얹히는 투명 또는 반투명 인터랙션 영역이다.

- 좌표는 video container 기준 퍼센트로 관리한다.
- 특정 시간 구간에서만 보인다.
- 클릭 시 Explain View 변경, Pause, Jump, Next Scene 등을 실행한다.

## 데이터 구조

```js
interactions: [
  {
    id: "hotspot-product-card",
    type: "hotspot",
    timeRange: {
      start: 4,
      end: 9
    },
    label: "제품 추천 카드",
    showLabel: true,
    x: 68,
    y: 42,
    width: 18,
    height: 12,
    action: {
      type: "syncExplain",
      explainStepId: "explain-product-card"
    }
  }
]
```

## Codex 프롬프트

```text
Demo View에 Interaction Hotspot 기능을 구현해줘.

요구사항:
1. scene.demo.interactions 배열을 읽어서 hotspot을 생성한다.
2. 각 hotspot은 timeRange.start ~ timeRange.end 사이에만 화면에 표시한다.
3. x, y, width, height는 video container 기준 퍼센트 좌표로 해석한다.
4. hotspot을 클릭하면 action을 실행한다.
5. action.type은 syncExplain, pause, jumpToTime, nextScene을 지원한다.
6. syncExplain은 Explain View에 explainStepId를 BroadcastChannel로 전달한다.
7. pause는 현재 영상을 정지한다.
8. jumpToTime은 지정된 video time으로 이동한다.
9. nextScene은 다음 scene으로 이동한다.
10. hotspot label을 표시할지 여부는 showLabel 속성으로 제어한다.
11. 발표 모드에서는 hotspot border를 숨길 수 있도록 debugHotspots 옵션을 둔다.
12. debugHotspots가 true이면 hotspot 영역과 label을 명확히 보여준다.
```

## 액션 예시

```js
{
  type: "syncExplain",
  explainStepId: "explain-product-card"
}
```

```js
{
  type: "jumpToTime",
  time: 12.5
}
```

```js
{
  type: "pause"
}
```

## 완료 기준

- 특정 시간 구간에서만 Hotspot이 표시된다.
- Hotspot 클릭 시 Explain View가 변경된다.
- Controller의 debugHotspots 토글로 Hotspot 표시 방식을 바꿀 수 있다.
