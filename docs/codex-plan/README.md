# Dual Sync Interactive Demo Presentation - Codex Prompt Pack

이 폴더는 HTML 기반 듀얼 모니터 인터랙티브 프리젠테이션 시스템을 Codex로 개발하기 위한 단계별 MD 파일 세트입니다.

## 사용 방법

1. 기존 dual sync HTML 예시 프로젝트를 준비합니다.
2. `00_overview.md`를 먼저 읽고 전체 목표를 확인합니다.
3. `01_refactor_project_structure.md`부터 순서대로 Codex에 투입합니다.
4. 각 단계가 끝날 때마다 `10_test_checklist.md` 기준으로 테스트합니다.
5. 기능이 안정화되면 `09_authoring_mode_mvp.md`를 진행합니다.

## 권장 진행 순서

```text
00_overview.md
01_refactor_project_structure.md
02_scene_data_model.md
03_video_timeline_engine.md
04_explain_step_sync.md
05_hotspot_interactions.md
06_zoom_and_speed.md
07_controller_console.md
08_sample_demo_scenario.md
09_authoring_mode_mvp.md
10_test_checklist.md
```

## 개발 원칙

- 한 번에 모든 기능을 만들지 않습니다.
- 각 단계가 끝날 때마다 브라우저에서 수동 테스트 가능한 상태를 유지합니다.
- Demo View, Explain View, Controller View가 느슨하게 결합되도록 합니다.
- Interaction Point는 scene data로 선언적으로 관리합니다.
- 발표 중 안정성이 중요하므로 수동 제어를 우선합니다.
