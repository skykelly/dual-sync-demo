export const scenes = [
  {
    id: "scene-01",
    title: "상황 기반 질문",
    description: "고객이 제품명이 아니라 생활 상황으로 AI Shopping Agent에게 질문하는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 0,
        end: 14
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "scene-01-context-question",
          time: 3,
          type: "syncExplain",
          explainStepId: "scene-01-context"
        },
        {
          id: "scene-01-ux-shift",
          time: 9,
          type: "syncExplain",
          explainStepId: "scene-01-shift"
        }
      ],
      interactions: [],
      zoomEvents: []
    },
    explain: {
      defaultStepId: "scene-01-default",
      steps: [
        {
          id: "scene-01-default",
          title: "고객은 제품명이 아니라 상황으로 질문한다",
          subtitle: "AI Shopping Agent 데모의 출발점",
          bullets: [
            "검색어보다 고객의 생활 상황이 먼저 등장",
            "고객은 제품 스펙을 몰라도 자신의 문제를 설명할 수 있음",
            "대화형 접점은 구매 여정 초입에서 더 많은 맥락을 확보"
          ],
          keyMessage: "검색 중심 UX에서 대화 중심 UX로 전환된다.",
          script: "첫 장면은 고객이 제품명을 찾는 대신 자신의 상황을 설명하면서 쇼핑 여정을 시작한다는 점을 보여줍니다."
        },
        {
          id: "scene-01-context",
          title: "상황 질문은 고객 데이터를 만든다",
          subtitle: "질문 자체가 추천과 상담의 입력값",
          bullets: [
            "사용 공간, 가족 구성, 예산, 설치 제약이 자연어 안에 포함",
            "AI는 고객의 표현을 구매 판단에 필요한 단서로 전환",
            "초기 질문 품질이 이후 추천 품질을 좌우"
          ],
          keyMessage: "질문 자체가 고객 데이터가 된다.",
          script: "고객의 자연어 질문은 단순 텍스트가 아니라 추천과 상담에 필요한 고객 데이터의 시작점입니다."
        },
        {
          id: "scene-01-shift",
          title: "대화형 UX는 탐색 비용을 낮춘다",
          subtitle: "카테고리 탐색 이전에 의도를 먼저 파악",
          bullets: [
            "고객이 카테고리 구조를 학습하지 않아도 됨",
            "AI가 애매한 니즈를 상품 판단 기준으로 정리",
            "초기 대화가 다음 화면과 상담 흐름을 개인화"
          ],
          keyMessage: "AI Shopping Agent는 검색창이 아니라 구매 여정의 안내자다.",
          script: "핵심은 검색창을 더 똑똑하게 만드는 것이 아니라 고객의 구매 여정 자체를 대화 중심으로 바꾸는 것입니다."
        }
      ]
    }
  },
  {
    id: "scene-02",
    title: "AI 질문 이해",
    description: "AI가 자연어 질문에서 고객 맥락과 제약 조건을 추출하는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 14,
        end: 31
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "scene-02-extract-context",
          time: 18,
          type: "syncExplain",
          explainStepId: "scene-02-extraction"
        },
        {
          id: "scene-02-qualify-intent",
          time: 25,
          type: "syncExplain",
          explainStepId: "scene-02-qualification"
        }
      ],
      interactions: [
        {
          id: "hotspot-scene-02-context-panel",
          type: "hotspot",
          timeRange: {
            start: 17,
            end: 27
          },
          label: "고객 맥락 추출",
          showLabel: true,
          x: 18,
          y: 28,
          width: 31,
          height: 36,
          action: {
            type: "syncExplain",
            explainStepId: "scene-02-extraction"
          }
        },
        {
          id: "hotspot-scene-02-constraints",
          type: "hotspot",
          timeRange: {
            start: 22,
            end: 30
          },
          label: "설치/예산 조건",
          showLabel: true,
          x: 54,
          y: 36,
          width: 27,
          height: 24,
          action: {
            type: "syncExplain",
            explainStepId: "scene-02-qualification"
          }
        }
      ],
      zoomEvents: []
    },
    explain: {
      defaultStepId: "scene-02-default",
      steps: [
        {
          id: "scene-02-default",
          title: "AI는 질문을 고객 맥락으로 구조화한다",
          subtitle: "자연어 이해가 추천 엔진의 첫 단계",
          bullets: [
            "문장 속에서 공간, 예산, 가족 구성, 사용 목적을 분리",
            "추가 질문이 필요한 정보와 충분한 정보를 구분",
            "고객이 말한 맥락을 이후 화면에서 계속 유지"
          ],
          keyMessage: "AI는 고객 말을 제품 판단 기준으로 번역한다.",
          script: "두 번째 장면은 AI가 자연어를 그대로 답변하지 않고 추천 가능한 구조로 바꾸는 과정을 설명합니다."
        },
        {
          id: "scene-02-extraction",
          title: "고객 맥락 추출이 구매 여정을 개인화한다",
          subtitle: "질문 안의 상황 정보가 다음 행동을 결정",
          bullets: [
            "공간: 거실, 주방, 세탁실 같은 설치 환경",
            "사용자: 1인 가구, 신혼, 아이 있는 가족, 반려동물 가정",
            "목적: 교체, 첫 구매, 업그레이드, 선물"
          ],
          keyMessage: "질문 자체가 고객 데이터가 된다.",
          script: "핫스팟으로 표시된 맥락 패널은 고객 질문이 어떻게 구조화되는지 보여주는 핵심 영역입니다."
        },
        {
          id: "scene-02-qualification",
          title: "제약 조건은 추천 실패를 줄인다",
          subtitle: "좋은 추천은 먼저 불가능한 선택지를 제거",
          bullets: [
            "설치 가능성, 예산 범위, 배송 일정 같은 탈락 조건 확인",
            "고객에게 맞지 않는 제품을 추천하는 위험 감소",
            "Sales AI Team이 상담 전에 확인해야 할 항목을 자동 정리"
          ],
          keyMessage: "조건을 먼저 이해해야 추천이 신뢰를 얻는다.",
          script: "AI가 조건을 명확히 잡아야 이후 Sales AI Team이 같은 고객 맥락을 기준으로 상담을 이어갈 수 있습니다."
        }
      ]
    }
  },
  {
    id: "scene-03",
    title: "Knowledge Atlas 추천",
    description: "AI가 Knowledge Atlas를 기반으로 추천 카드와 추천 근거를 제시하는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 31,
        end: 50
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "scene-03-atlas-match",
          time: 35,
          type: "syncExplain",
          explainStepId: "scene-03-atlas"
        },
        {
          id: "scene-03-recommend-card",
          time: 41,
          type: "syncExplain",
          explainStepId: "scene-03-recommendation"
        }
      ],
      interactions: [
        {
          id: "hotspot-scene-03-atlas",
          type: "hotspot",
          timeRange: {
            start: 34,
            end: 43
          },
          label: "Knowledge Atlas",
          showLabel: true,
          x: 12,
          y: 24,
          width: 30,
          height: 34,
          action: {
            type: "syncExplain",
            explainStepId: "scene-03-atlas"
          }
        },
        {
          id: "hotspot-scene-03-card",
          type: "hotspot",
          timeRange: {
            start: 40,
            end: 49
          },
          label: "추천 카드",
          showLabel: true,
          x: 55,
          y: 20,
          width: 31,
          height: 45,
          action: {
            type: "syncExplain",
            explainStepId: "scene-03-recommendation"
          }
        }
      ],
      zoomEvents: [
        {
          id: "zoom-scene-03-card",
          time: 41,
          duration: 0.5,
          scale: 1.55,
          x: 70,
          y: 42,
          explainStepId: "scene-03-recommendation"
        },
        {
          id: "zoom-scene-03-reset",
          time: 48,
          duration: 0.4,
          scale: 1,
          x: 50,
          y: 50
        }
      ]
    },
    explain: {
      defaultStepId: "scene-03-default",
      steps: [
        {
          id: "scene-03-default",
          title: "추천의 차별화는 상품이 아니라 근거다",
          subtitle: "고객 맥락과 제품 지식을 연결한 설명 가능한 추천",
          bullets: [
            "같은 상품도 고객 맥락에 따라 추천 이유가 달라짐",
            "추천 카드에는 제품명보다 선택 근거가 먼저 보여야 함",
            "설명 가능한 근거가 상담 전환의 신뢰를 만듦"
          ],
          keyMessage: "추천의 차별화는 상품이 아니라 근거다.",
          script: "세 번째 장면은 AI가 단순히 상품을 나열하는 것이 아니라 왜 이 상품인지 설명하는 부분입니다."
        },
        {
          id: "scene-03-atlas",
          title: "Knowledge Atlas가 추천 판단의 기준이 된다",
          subtitle: "제품, 고객, 비즈니스 지식을 하나의 판단 체계로 연결",
          bullets: [
            "제품 지식: 스펙, 설치 조건, 라인업, 리뷰, 비교 기준",
            "고객 지식: 선호, 여정, 상담 이력, 구매 맥락",
            "비즈니스 지식: 프로모션, 재고, 정책, 채널 운영 규칙"
          ],
          keyMessage: "LLM보다 중요한 것은 LLM이 참조하는 지식 구조다.",
          script: "Knowledge Atlas는 Sales AI Team이 같은 기준으로 고객을 이해하고 추천을 설명하게 만드는 공통 지식 기반입니다."
        },
        {
          id: "scene-03-recommendation",
          title: "추천 카드는 결정 부담을 낮추는 인터페이스다",
          subtitle: "추천 제품과 추천 이유가 같은 화면에서 제시",
          bullets: [
            "고객 조건과 일치하는 근거를 카드 안에서 확인",
            "대안 제품과 비교할 때도 같은 판단 기준을 사용",
            "확대되는 카드 영역은 발표자가 근거 설명에 집중하도록 설계"
          ],
          keyMessage: "추천 UI는 목록이 아니라 의사결정 보조 도구다.",
          script: "이 구간의 Zoom Event는 추천 카드 영역을 확대해 제품보다 추천 근거가 중요하다는 메시지를 강조합니다."
        }
      ]
    }
  },
  {
    id: "scene-04",
    title: "상담 전환",
    description: "온라인 AI 상담이 예약, 매장 연결, 설치 실행으로 이어지는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 50,
        end: 66
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "scene-04-cta",
          time: 54,
          type: "syncExplain",
          explainStepId: "scene-04-cta"
        },
        {
          id: "scene-04-handoff",
          time: 61,
          type: "syncExplain",
          explainStepId: "scene-04-handoff"
        }
      ],
      interactions: [],
      zoomEvents: []
    },
    explain: {
      defaultStepId: "scene-04-default",
      steps: [
        {
          id: "scene-04-default",
          title: "AI 상담은 오프라인 실행으로 연결되어야 한다",
          subtitle: "온라인 대화에서 실제 구매 행동으로 전환",
          bullets: [
            "추천 이후 다음 행동이 명확해야 전환율이 높아짐",
            "상담 예약, 매장 방문, 설치 가능 확인을 한 흐름으로 연결",
            "AI가 고객 접점과 현장 실행 사이의 단절을 줄임"
          ],
          keyMessage: "AI는 고객 접점과 현장 실행을 연결해야 한다.",
          script: "네 번째 장면은 AI가 답변에서 끝나지 않고 고객의 다음 행동을 만들어야 한다는 메시지입니다."
        },
        {
          id: "scene-04-cta",
          title: "CTA는 고객 맥락을 유지한 상태에서 제안된다",
          subtitle: "예약 버튼도 개인화된 다음 단계",
          bullets: [
            "고객 조건에 맞는 매장, 상담 시간, 설치 옵션을 제안",
            "고객이 다시 설명하지 않도록 대화 맥락을 함께 전달",
            "온라인 채널의 의도를 오프라인 실행 계획으로 변환"
          ],
          keyMessage: "전환 CTA는 단순 버튼이 아니라 실행 제안이다.",
          script: "상담 예약 CTA는 일반적인 버튼이 아니라 고객 맥락을 반영한 다음 실행 제안이어야 합니다."
        },
        {
          id: "scene-04-handoff",
          title: "Sales AI Team이 채널 간 문맥을 이어준다",
          subtitle: "온라인 상담 내용이 매장과 설치 단계로 전달",
          bullets: [
            "AI Shopping Agent가 만든 요약을 Sales Copilot이 이어받음",
            "매장 직원은 고객의 관심 제품과 고민 지점을 미리 확인",
            "현장 상담은 처음부터 더 높은 품질로 시작"
          ],
          keyMessage: "채널 전환의 품질은 문맥 전달에서 결정된다.",
          script: "Sales AI Team의 가치는 여러 AI 역할이 고객 문맥을 끊기지 않게 전달하는 데 있습니다."
        }
      ]
    }
  },
  {
    id: "scene-05",
    title: "Sales Copilot",
    description: "고객 대화 맥락이 매장 직원용 Sales Copilot 화면으로 전달되는 장면",
    demo: {
      videoSrc: "assets/videos/demo.mp4",
      trim: {
        start: 66,
        end: 84
      },
      playbackRate: 1,
      timeEvents: [
        {
          id: "scene-05-summary",
          time: 70,
          type: "syncExplain",
          explainStepId: "scene-05-summary"
        },
        {
          id: "scene-05-quality",
          time: 77,
          type: "syncExplain",
          explainStepId: "scene-05-quality"
        }
      ],
      interactions: [],
      zoomEvents: []
    },
    explain: {
      defaultStepId: "scene-05-default",
      steps: [
        {
          id: "scene-05-default",
          title: "고객 기억이 상담 품질을 높인다",
          subtitle: "Sales Copilot은 고객 문맥을 매장 직원에게 전달",
          bullets: [
            "고객이 온라인에서 말한 조건과 우려를 상담 전에 확인",
            "추천 제품, 비교 후보, 미해결 질문을 한 화면에 요약",
            "직원은 제품 설명보다 고객 문제 해결에 집중"
          ],
          keyMessage: "고객 기억이 상담 품질을 높인다.",
          script: "마지막 장면은 고객 대화 맥락이 매장 직원에게 전달되어 상담 품질을 높이는 모습을 보여줍니다."
        },
        {
          id: "scene-05-summary",
          title: "Sales Copilot은 상담 준비 시간을 줄인다",
          subtitle: "온라인 대화 요약이 직원의 시작점을 바꾼다",
          bullets: [
            "고객 프로필, 관심 제품, 제약 조건을 즉시 파악",
            "반복 질문을 줄이고 상담을 더 빠르게 본론으로 이동",
            "직원 경험과 AI 요약이 결합되어 상담 일관성 강화"
          ],
          keyMessage: "매장 직원은 고객을 처음부터 다시 이해하지 않아도 된다.",
          script: "Sales Copilot은 직원이 고객을 다시 파악하는 시간을 줄이고, 상담을 바로 핵심 이슈에서 시작하게 합니다."
        },
        {
          id: "scene-05-quality",
          title: "Sales AI Team은 고객 경험을 하나로 묶는다",
          subtitle: "AI Shopping Agent에서 Sales Copilot까지 이어지는 운영 모델",
          bullets: [
            "AI Shopping Agent는 고객 의도와 추천 근거를 생성",
            "Knowledge Atlas는 공통 지식과 판단 기준을 제공",
            "Sales Copilot은 현장 실행과 상담 품질을 끌어올림"
          ],
          keyMessage: "AI는 개별 기능이 아니라 연결된 팀으로 설계되어야 한다.",
          script: "결론적으로 Sales AI Team은 개별 기능 묶음이 아니라 고객 여정을 이어주는 역할 체계로 설계되어야 합니다."
        }
      ]
    }
  }
];
