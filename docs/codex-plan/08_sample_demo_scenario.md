# Step 8. 샘플 Demo Scenario 작성

## 목표

개발된 기능을 검증할 수 있는 샘플 시나리오를 작성한다. 주제는 AI Shopping Agent 또는 Sales AI Team 데모로 한다.

## 샘플 시나리오 개요

```text
Scene 1. 문제 제기: 고객은 제품명이 아니라 상황으로 질문한다
Scene 2. AI 질문 이해: 자연어에서 고객 맥락 추출
Scene 3. 제품 추천: Knowledge Atlas 기반 추천 근거 제시
Scene 4. 상담 전환: 온라인 상담에서 오프라인 실행으로 연결
Scene 5. Sales Copilot: 고객 대화 맥락이 매장 직원에게 전달
```

## Codex 프롬프트

```text
data/scenes.js에 AI Shopping Agent 샘플 데모 시나리오 5개 scene을 작성해줘.

요구사항:
1. 모든 scene은 assets/videos/demo.mp4를 사용한다.
2. 각 scene에는 trim.start와 trim.end를 다르게 설정한다.
3. 각 scene에는 최소 2개 이상의 explain step이 있어야 한다.
4. 각 scene에는 최소 1개 이상의 timeEvent를 넣는다.
5. Scene 2와 Scene 3에는 hotspot interaction을 넣는다.
6. Scene 3에는 zoomEvents를 넣어서 추천 카드 영역이 확대되는 효과를 만든다.
7. 설명 내용은 Sales AI Team / Knowledge Atlas / AI Shopping Agent 맥락에 맞게 작성한다.
8. 실제 영상이 없어도 데이터 구조 검증이 가능하도록 작성한다.
```

## 샘플 메시지 방향

### Scene 1

- Demo: 고객이 검색창 또는 AI 입력창을 보는 장면
- Explain: 고객은 제품명이 아니라 상황으로 질문한다
- Key Message: 검색 중심 UX에서 대화 중심 UX로 전환

### Scene 2

- Demo: 고객이 자연어 질문 입력
- Explain: AI가 공간, 예산, 가족 구성, 설치 조건을 추출
- Key Message: 질문 자체가 고객 데이터가 된다

### Scene 3

- Demo: AI 추천 카드 표시
- Explain: 제품 지식과 고객 맥락을 연결한 추천
- Key Message: 추천의 차별화는 상품이 아니라 근거다

### Scene 4

- Demo: 상담 예약 또는 매장 연결 CTA
- Explain: 온라인 AI 상담이 오프라인 실행으로 연결
- Key Message: AI는 고객 접점과 현장 실행을 연결해야 한다

### Scene 5

- Demo: 매장 직원용 상담 요약 화면
- Explain: 고객 대화 맥락이 Sales Copilot으로 전달
- Key Message: 고객 기억이 상담 품질을 높인다

## 완료 기준

- 5개 scene이 모두 정상 렌더링된다.
- 각 scene에서 Explain Step 전환이 가능하다.
- Scene 2/3에서 Hotspot이 표시된다.
- Scene 3에서 Zoom Event가 동작한다.
