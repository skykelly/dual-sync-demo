# Step 10. 테스트 체크리스트

## 1. 기본 실행 테스트

- [ ] `index.html?view=controller` 실행 가능
- [ ] `index.html?view=demo` 실행 가능
- [ ] `index.html?view=explain` 실행 가능
- [ ] 세 창을 동시에 열었을 때 콘솔 오류 없음

## 2. Dual Sync 테스트

- [ ] Controller에서 Next 클릭 시 Demo View 변경
- [ ] Controller에서 Next 클릭 시 Explain View 변경
- [ ] Controller에서 Prev 클릭 시 두 View 모두 변경
- [ ] Scene 목록 클릭 시 해당 Scene으로 이동

## 3. Video Timeline 테스트

- [ ] Scene 진입 시 trim.start에서 시작
- [ ] trim.end 도달 시 자동 pause
- [ ] Restart Scene 클릭 시 trim.start로 복귀
- [ ] Play/Pause 버튼 동작
- [ ] 현재 video time이 Controller에 표시

## 4. Time Event 테스트

- [ ] syncExplain 이벤트가 지정 시간에 실행
- [ ] pause 이벤트가 지정 시간에 실행
- [ ] nextScene 이벤트가 지정 시간에 실행
- [ ] 같은 이벤트가 중복 실행되지 않음

## 5. Explain Step 테스트

- [ ] Scene 진입 시 defaultStepId 표시
- [ ] syncExplain 메시지 수신 시 해당 step 표시
- [ ] 없는 explainStepId 수신 시 default step 표시
- [ ] Controller에서 explain step 직접 선택 가능

## 6. Hotspot 테스트

- [ ] timeRange 밖에서는 Hotspot이 보이지 않음
- [ ] timeRange 안에서는 Hotspot이 보임
- [ ] Hotspot 클릭 시 action 실행
- [ ] debugHotspots On/Off 동작
- [ ] 좌표가 해상도 변경에도 크게 틀어지지 않음

## 7. Zoom 테스트

- [ ] zoomEvents가 지정 시간에 실행
- [ ] scale 값이 적용됨
- [ ] transform-origin이 x/y 기준으로 적용됨
- [ ] duration transition이 적용됨
- [ ] Reset Zoom 동작

## 8. Playback Speed 테스트

- [ ] 0.5x 적용
- [ ] 0.75x 적용
- [ ] 1x 적용
- [ ] 1.25x 적용
- [ ] 1.5x 적용
- [ ] Scene 변경 시 기본 playbackRate 적용

## 9. Authoring Mode 테스트

- [ ] `index.html?view=author` 실행 가능
- [ ] 영상 경로 입력 후 로드 가능
- [ ] 현재 time 확인 가능
- [ ] 영상 클릭 좌표를 퍼센트로 저장
- [ ] Hotspot JSON 생성 가능
- [ ] Time Event JSON 생성 가능
- [ ] Zoom Event JSON 생성 가능
- [ ] Copy JSON 동작

## 10. 발표 환경 테스트

- [ ] 듀얼 모니터에서 Demo View 전체화면 정상
- [ ] 듀얼 모니터에서 Explain View 전체화면 정상
- [ ] Controller 창에서 조작 시 두 화면 동기화 정상
- [ ] 오프라인 상태에서 실행 가능
- [ ] 영상 파일 경로가 깨지지 않음
- [ ] 발표 중 브라우저 자동재생 정책 문제 없음

## 11. 검증 기록

Last updated: 2026-06-01 00:22 KST

Automated/static checks completed:

- [x] `node --check` syntax validation for `data/*.js` and `src/*.js`
- [x] Scene data validation for scene count, trim ranges, explain step references, hotspot coordinates, time events, and zoom events
- [x] Server route checks returned `200 OK` for:
  - `index.html?view=controller`
  - `index.html?view=demo`
  - `index.html?view=explain`
  - `index.html?view=author`
- [x] Node render smoke check for Controller, Demo, Explain, and Author views

Manual test status:

- [ ] Full checklist execution still requires a browser session with `assets/videos/demo.mp4` present.
- [ ] Dual-monitor fullscreen validation must be performed in the actual presentation environment.
- [ ] Browser autoplay policy behavior must be verified in the presentation browser/profile.
