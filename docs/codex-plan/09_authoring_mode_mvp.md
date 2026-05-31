# Step 9. Authoring Mode MVP 추가

## 목표

개발자가 `data/scenes.js`를 직접 편집하지 않아도, 영상 위에서 interaction point와 time event를 잡을 수 있는 간단한 Authoring View를 만든다.

초기에는 완성형 편집기가 아니라 JSON 생성 보조 도구로 구현한다.

## 실행 URL

```text
index.html?view=author
```

## Authoring MVP 기능

1. 영상 경로 입력
2. 영상 재생/정지
3. 현재 time 표시
4. Add Hotspot
5. 영상 클릭 좌표를 퍼센트로 저장
6. Hotspot width/height/label/explainStepId 입력
7. Add Time Event
8. Add Zoom Event
9. Scene JSON 미리보기
10. Copy JSON 버튼

## Codex 프롬프트

```text
Authoring View의 MVP를 추가해줘.

요구사항:
1. index.html?view=author 모드를 추가한다.
2. src/authorView.js를 새로 만든다.
3. 영상을 재생하면서 현재 time을 확인할 수 있게 한다.
4. 영상 경로를 입력하면 해당 영상을 로드할 수 있게 한다.
5. Add Hotspot 버튼을 누른 뒤 영상 위를 클릭하면 해당 좌표를 퍼센트 x/y로 저장한다.
6. hotspot width/height/label/explainStepId를 입력할 수 있게 한다.
7. Add Time Event 버튼으로 현재 time에 pause 또는 syncExplain 이벤트를 추가할 수 있게 한다.
8. Add Zoom Event 버튼으로 현재 time에 scale/x/y/duration 값을 추가할 수 있게 한다.
9. 생성된 scene data를 JSON 형태로 미리보기한다.
10. Copy JSON 버튼을 제공한다.
11. 파일 저장은 우선 지원하지 않아도 된다.
12. 생성된 JSON은 data/scenes.js에 붙여넣기 쉬운 구조여야 한다.
```

## Authoring View UI 예시

```text
[Video Path Input] [Load]
[Play] [Pause]
Current Time: 07.25s

[Add Hotspot]
Label: 제품 추천 카드
Width: 18
Height: 12
Explain Step ID: explain-product-card

[Add Time Event]
Type: syncExplain
Explain Step ID: explain-input

[Add Zoom Event]
Scale: 1.8
Duration: 0.5
Origin X/Y: 현재 클릭 지점 사용

[Generated JSON Preview]
[Copy JSON]
```

## 완료 기준

- Author View에서 영상 클릭 좌표를 퍼센트로 얻을 수 있다.
- Hotspot JSON을 생성할 수 있다.
- Time Event JSON을 생성할 수 있다.
- Zoom Event JSON을 생성할 수 있다.
- Copy JSON 버튼으로 클립보드 복사가 가능하다.
