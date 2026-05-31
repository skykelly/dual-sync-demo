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
          time: 9,
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
          subtitle: "입력 영역에서 고객 맥락이 구조화된다",
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
  },
  {
    id: "scene-02",
    title: "추천 후보 압축",
    description: "AI가 고객 조건과 제품 조건을 바탕으로 추천 후보를 좁히는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 12,
        end: 28
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "event-show-condition-match",
          time: 15,
          type: "syncExplain",
          explainStepId: "explain-conditions"
        },
        {
          id: "event-show-recommendation",
          time: 23,
          type: "syncExplain",
          explainStepId: "explain-recommendation"
        }
      ],
      interactions: [
        {
          id: "hotspot-recommendation-card",
          type: "hotspot",
          timeRange: {
            start: 18,
            end: 27
          },
          label: "추천 카드",
          showLabel: true,
          x: 64,
          y: 54,
          width: 24,
          height: 24,
          action: {
            type: "syncExplain",
            explainStepId: "explain-recommendation"
          }
        }
      ],
      zoomEvents: [
        {
          id: "zoom-condition-panel",
          time: 15,
          duration: 0.4,
          scale: 1.4,
          x: 36,
          y: 52,
          explainStepId: "explain-conditions"
        },
        {
          id: "zoom-recommendation-card",
          time: 23,
          duration: 0.4,
          scale: 1.5,
          x: 64,
          y: 54,
          explainStepId: "explain-recommendation"
        }
      ]
    },
    explain: {
      defaultStepId: "explain-default",
      steps: [
        {
          id: "explain-default",
          title: "추천은 제품 나열이 아니라 조건 압축이다",
          subtitle: "고객 조건에 맞지 않는 선택지를 빠르게 제거",
          bullets: [
            "고객 조건: 공간, 예산, 가족 구성, 사용 빈도",
            "제품 조건: 설치 가능성, 용량, 기능, 가격대",
            "비즈니스 조건: 프로모션, 재고, 구독 가능 여부"
          ],
          keyMessage: "추천 품질은 지식 구조화 수준에 의해 결정된다.",
          script: "좋은 AI 추천은 많은 제품을 보여주는 것이 아니라 고객 조건에 맞지 않는 선택지를 제거하는 것입니다."
        },
        {
          id: "explain-conditions",
          title: "조건 매칭이 추천의 기준점이 된다",
          subtitle: "고객 맥락과 제품 제약을 같은 구조로 비교",
          bullets: [
            "생활 맥락을 추천 가능한 속성으로 변환",
            "설치, 용량, 예산 같은 탈락 조건을 먼저 검증",
            "후보가 줄어들수록 상담 메시지가 선명해짐"
          ],
          keyMessage: "AI는 고객 말을 제품 판단 기준으로 번역한다.",
          script: "이 단계에서는 고객의 말을 제품 속성과 비교 가능한 조건으로 바꾸는 과정이 중요합니다."
        },
        {
          id: "explain-recommendation",
          title: "추천 카드는 결정 부담을 낮추는 인터페이스다",
          subtitle: "선택지는 적고 이유는 명확해야 한다",
          bullets: [
            "추천 이유를 카드 안에서 즉시 확인",
            "고객 조건과 맞는 근거를 함께 표시",
            "다음 상담이나 매장 방문으로 이어질 수 있음"
          ],
          keyMessage: "추천 UI는 목록이 아니라 의사결정 보조 도구다.",
          script: "추천 카드는 단순 상품 목록이 아니라 고객이 왜 이 선택지를 봐야 하는지 알려주는 의사결정 도구입니다."
        }
      ]
    }
  },
  {
    id: "scene-03",
    title: "추천 근거 설명",
    description: "제품 지식, 고객 기억, 비즈니스 지식을 연결해 AI 추천 근거를 설명하는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 28,
        end: 45
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "event-knowledge-atlas",
          time: 31,
          type: "syncExplain",
          explainStepId: "explain-atlas"
        },
        {
          id: "event-handoff",
          time: 40,
          type: "syncExplain",
          explainStepId: "explain-handoff"
        }
      ],
      interactions: [
        {
          id: "hotspot-knowledge-graph",
          type: "hotspot",
          timeRange: {
            start: 30,
            end: 38
          },
          label: "Knowledge Atlas",
          showLabel: true,
          x: 50,
          y: 48,
          width: 34,
          height: 28,
          action: {
            type: "syncExplain",
            explainStepId: "explain-atlas"
          }
        },
        {
          id: "hotspot-store-handoff",
          type: "hotspot",
          timeRange: {
            start: 39,
            end: 45
          },
          label: "매장 상담 연결",
          showLabel: true,
          x: 72,
          y: 68,
          width: 22,
          height: 12,
          action: {
            type: "syncExplain",
            explainStepId: "explain-handoff"
          }
        }
      ],
      zoomEvents: [
        {
          id: "zoom-knowledge-graph",
          time: 31,
          duration: 0.5,
          scale: 1.45,
          x: 50,
          y: 48,
          explainStepId: "explain-atlas"
        },
        {
          id: "zoom-store-handoff",
          time: 40,
          duration: 0.5,
          scale: 1.5,
          x: 72,
          y: 68,
          explainStepId: "explain-handoff"
        }
      ]
    },
    explain: {
      defaultStepId: "explain-default",
      steps: [
        {
          id: "explain-default",
          title: "추천 근거가 신뢰를 만든다",
          subtitle: "AI 판단의 기준을 발표자가 설명할 수 있어야 한다",
          bullets: [
            "제품 지식과 고객 맥락을 함께 사용",
            "추천 이유가 보이면 상담 전환 장벽이 낮아짐",
            "근거 없는 생성형 답변보다 운영 안정성이 높음"
          ],
          keyMessage: "설명 가능한 추천이 데모의 신뢰도를 높인다.",
          script: "이 장면은 AI 추천이 단순 생성이 아니라 설명 가능한 근거 위에서 만들어진다는 점을 보여줍니다."
        },
        {
          id: "explain-atlas",
          title: "Knowledge Atlas가 AI 판단의 공통 소스가 된다",
          subtitle: "제품, 고객, 비즈니스 지식을 하나의 판단 체계로 연결",
          bullets: [
            "제품 지식: 스펙, 설치, 라인업, 리뷰, 비교 기준",
            "고객 지식: 선호, 여정, 상담 이력, 구매와 AS 맥락",
            "비즈니스 지식: 프로모션, 정책, 채널, 성과, 운영 규칙"
          ],
          keyMessage: "LLM보다 중요한 것은 LLM이 참조하는 지식 구조다.",
          script: "Knowledge Atlas는 제품, 고객, 비즈니스 지식을 연결하는 공통 판단 체계입니다."
        },
        {
          id: "explain-handoff",
          title: "온라인 AI 상담은 오프라인 실행으로 완성된다",
          subtitle: "대화 맥락을 매장 상담과 설치 실행으로 연결",
          bullets: [
            "고객 대화 요약을 매장 직원에게 전달",
            "방문 전 상담 준비 수준 향상",
            "AI 접점과 물리 접점의 단절을 줄임"
          ],
          keyMessage: "AI는 고객 접점을 잇는 실행 레이어다.",
          script: "AI 상담의 차별화는 답변에서 끝나지 않고 매장, 설치, 케어까지 이어질 때 만들어집니다."
        }
      ]
    }
  }
];
