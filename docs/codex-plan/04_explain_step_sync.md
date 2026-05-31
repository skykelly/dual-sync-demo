# Step 4. Explain View Step Sync 구현

## 목표

Explain View를 scene 단위가 아니라 explain step 단위로 렌더링하도록 확장한다.

## 배경

하나의 시연 장면 안에서도 설명은 여러 단계로 바뀔 수 있다.

예:

```text
Scene 2: AI 추천 결과
- 기본 설명
- 입력 영역 설명
- 추천 카드 설명
- Knowledge Atlas 설명
- CTA 설명
```

## Codex 프롬프트

```text
Explain View를 scene 단위가 아니라 explain step 단위로 렌더링하도록 확장해줘.

요구사항:
1. scene.explain.defaultStepId를 기본 설명으로 표시한다.
2. scene.explain.steps 배열을 지원한다.
3. SYNC_EXPLAIN 메시지를 받으면 해당 explainStepId에 맞는 내용을 표시한다.
4. explainStepId가 없거나 찾을 수 없으면 defaultStepId를 표시한다.
5. Explain View에는 title, subtitle, bullets, keyMessage, script를 표시할 수 있어야 한다.
6. 화면 전환 시 간단한 fade animation을 적용한다.
7. 현재 scene title과 explain step id를 작은 디버그 영역에 표시할 수 있도록 한다.
8. GO_TO_SCENE 메시지를 받으면 해당 scene의 defaultStepId를 표시한다.
```

## 메시지 예시

```js
{
  type: "SYNC_EXPLAIN",
  sceneIndex: 1,
  explainStepId: "explain-product-card"
}
```

## 렌더링 항목

Explain View는 다음 항목을 표시할 수 있어야 한다.

- scene title
- explain step title
- subtitle
- bullets
- keyMessage
- script 또는 speaker note
- 현재 step id 디버그 정보

## 완료 기준

- Scene 변경 시 기본 explain step이 표시된다.
- Demo View의 timeEvent에서 syncExplain을 보내면 Explain View가 변경된다.
- Controller에서 explain step을 직접 선택해도 Explain View가 변경된다.
