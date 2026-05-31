# Step 2. Scene Data Model 확장

## 목표

슬라이드 번호 중심 구조를 영상 타임라인/인터랙션 기반 구조로 확장한다.

## 기본 개념

이 시스템의 핵심은 HTML 화면이 아니라 `scene definition`이다. 모든 Demo/Explain 동작은 `data/scenes.js`에 선언적으로 정의한다.

## 권장 데이터 모델

```js
export const scenes = [
  {
    id: "scene-01",
    title: "고객 질문 시작",
    description: "고객이 제품명이 아니라 생활 상황으로 질문을 시작하는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 0,
        end: 12
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "event-input-focus",
          time: 3.5,
          type: "syncExplain",
          explainStepId: "explain-input"
        },
        {
          id: "event-pause-after-question",
          time: 8.5,
          type: "pause"
        }
      ],
      interactions: [
        {
          id: "hotspot-input-box",
          type: "hotspot",
          timeRange: {
            start: 3,
            end: 9
          },
          label: "질문 입력 영역",
          showLabel: true,
          x: 58,
          y: 45,
          width: 28,
          height: 10,
          action: {
            type: "syncExplain",
            explainStepId: "explain-input"
          }
        }
      ],
      zoomEvents: [
        {
          id: "zoom-input-box",
          time: 3.5,
          duration: 0.5,
          scale: 1.6,
          x: 62,
          y: 45,
          explainStepId: "explain-input"
        },
        {
          id: "zoom-reset",
          time: 9.0,
          duration: 0.5,
          scale: 1,
          x: 50,
          y: 50
        }
      ]
    },
    explain: {
      defaultStepId: "explain-default",
      steps: [
        {
          id: "explain-default",
          title: "고객은 제품명이 아니라 상황으로 질문한다",
          subtitle: "AI 쇼핑 UX의 출발점",
          bullets: [
            "기존 검색은 제품명과 카테고리 중심",
            "AI 시대 고객은 생활 맥락으로 질문",
            "브랜드는 고객 맥락을 선점해야 함"
          ],
          keyMessage: "검색 중심 UX에서 대화 중심 UX로 전환된다.",
          script: "이 장면은 고객이 제품명을 검색하는 대신 자신의 상황을 설명하는 출발점입니다."
        },
        {
          id: "explain-input",
          title: "자연어 질문이 구매 여정의 시작점이 된다",
          bullets: [
            "고객은 전문 용어를 몰라도 됨",
            "AI는 질문 안에서 공간, 예산, 가족 구성, 사용 목적을 추출",
            "이후 추천과 상담의 기준점으로 활용"
          ],
          keyMessage: "질문 자체가 고객 데이터가 된다.",
          script: "입력창은 단순 검색창이 아니라 고객의 니즈를 구조화하는 시작점입니다."
        }
      ]
    }
  }
];
```

## Codex 프롬프트

```text
기존 scenes.js를 영상 타임라인과 explain step을 지원하는 데이터 모델로 확장해줘.

요구사항:
1. data/scenes.js에서 scenes 배열을 export한다.
2. 각 scene은 id, title, description, demo, explain 속성을 가진다.
3. demo에는 videoSrc, trim, playbackRate, timeEvents, interactions, zoomEvents를 포함한다.
4. explain은 defaultStepId와 steps 배열을 가진다.
5. 기존 단순 슬라이드 데이터가 있다면 새로운 구조로 변환한다.
6. 샘플 scene 3개를 작성한다.
7. 샘플 videoSrc는 assets/videos/demo.mp4로 통일한다.
8. 실제 영상 파일이 없어도 화면이 깨지지 않도록 fallback UI를 준비한다.
```

## 완료 기준

- `data/scenes.js`에 새로운 구조의 scene이 3개 이상 있다.
- Demo View와 Explain View가 새 데이터 구조를 읽을 수 있다.
- 실제 영상 파일이 없어도 Demo View에 안내 메시지가 표시된다.
