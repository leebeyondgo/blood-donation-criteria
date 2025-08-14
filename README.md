# 헌혈 조건 검색 (Blood Donation Criteria)

헌혈 조건 간편 검색 서비스는 헌혈을 하고자 하는 모든 분들이 자신의 헌혈 가능 여부를 쉽고 빠르게 확인할 수 있도록 돕기 위해 만들어졌습니다. 복잡하고 찾기 어려운 헌혈 관련 규정들을 간편하게 검색하고, 기준 날짜에 맞춰 헌혈 가능일을 바로 계산해 보세요.

<br/>

## ✨ 주요 기능

-   **빠른 검색**: 약물, 질병, 방문 지역, 예방접종 등 다양한 헌혈 조건들을 키워드 하나로 즉시 검색할 수 있습니다.
-   **카테고리 필터**: `약물`, `질병`, `지역` 등 카테고리별로 조건을 필터링하여 원하는 정보만 모아볼 수 있습니다.
-   **자동 날짜 계산**: 헌혈 금지 기간이 있는 항목의 경우, 기준 날짜를 설정하면 헌혈이 가능한 날짜를 자동으로 계산하여 보여줍니다.
-   **다크 모드 지원**: 눈이 편안한 다크 모드를 지원하여 언제 어디서든 편안하게 이용할 수 있습니다.
-   **반응형 디자인**: PC, 태블릿, 모바일 등 어떤 기기에서든 최적화된 화면으로 정보를 확인할 수 있습니다.

<br/>

---

## 💻 사용 기술 (Tech Stack)

-   **Framework**: React
-   **UI Library**: Material-UI (MUI) with Emotion, Tailwind CSS
-   **Language**: JavaScript
-   **State Management**: React Context API

<br/>

---

## 📂 데이터 스키마 (Data Schema)

<details>
<summary>이 프로젝트에서 사용하는 데이터 구조를 보려면 여기를 클릭하세요.</summary>

<br>

이 프로젝트는 헌혈 조건에 대한 정보를 체계적으로 관리하기 위해 표준화된 JSON 스키마를 사용합니다. 각 데이터 파일(`medication.json`, `disease.json` 등)은 아래 구조를 따르는 객체 배열로 구성됩니다.

### 기본 필드

| 필드명      | 타입    | 설명                                                                 | 필수 여부 |
| :---------- | :------ | :------------------------------------------------------------------- | :-------- |
| `id`        | String  | 각 항목을 식별하는 고유 ID (예: "medication-001")                    | 예        |
| `category`  | String  | 데이터의 분류 (예: "medication", "disease", "vaccination")           | 예        |
| `name`      | String  | 항목의 공식 명칭 (예: "타이레놀 (아세트아미노펜 계열)")               | 예        |
| `keywords`  | Array   | 검색에 사용될 키워드 배열 (예: `["타이레놀", "아세트아미노펜"]`)      | 예        |
| `description`| String  | 항목에 대한 상세 설명                                                | 예        |
| `allowable` | Boolean | 헌혈이 즉시 가능한지 여부 (`true`이면 가능, `false`이면 조건부 또는 불가) | 예        |
| `restriction`| Object  | 헌혈 제한 조건에 대한 상세 정보를 담는 객체. `allowable`이 `false`일 때 필수 | 아니요    |

<br>

### `restriction` 객체 필드

`allowable`이 `false`일 때, `restriction` 객체는 다음과 같은 필드를 가집니다.

| 필드명          | 타입   | 설명                                                                               |
| :-------------- | :----- | :--------------------------------------------------------------------------------- |
| `type`          | String | 제한 유형. "period"(기간), "permanent"(영구), "after_recovery"(회복 후), "condition_check"(조건 확인), "period_multi"(복수 기간) 등          |
| `periodValue`   | Number | 제한 기간의 숫자 값 (예: `3`, `6`). `type`이 "period"일 때 사용. 영구 금지는 `-1` |
| `periodUnit`    | String | 제한 기간의 단위 (예: "day", "week", "month", "year"). `type`이 "period"일 때 사용. |
| `condition`     | String | 사용자에게 표시될 구체적인 조건 설명 (예: "복용 당일 헌혈 불가"). `type`이 "period", "after_recovery", "condition_check"일 때 사용. |
| `periods`       | Array  | `type`이 "period_multi"일 때 사용. 각 객체는 `value`(Number), `unit`(String), `condition`(String) 필드를 가짐. |

<br>

### `region.json`의 추가 스키마

`category`가 "region"으로 시작하는 데이터는 다음과 같은 추가 필드를 가질 수 있습니다.

| 필드명          | 타입   | 설명                                                                               |
| :-------------- | :----- | :--------------------------------------------------------------------------------- |
| `continent`     | String | 해당 지역이 속한 대륙 (예: "아시아", "아프리카", "유럽")                     |
| `risk_areas`    | Array  | 위험 지역 목록. 각 객체는 `type`(String, 예: "country", "city/county"), `name`(String), `condition`(String, 선택 사항) 필드를 가짐. |
| `exception_areas`| Array  | 예외 지역 목록. `risk_areas`와 동일한 구조.                                        |
| `countries`     | Array  | 국가별 상세 규칙 목록. 각 객체는 `countryName`(String), `ruleType`(String, 예: "exclusion", "inclusion"), `note`(String, 선택 사항), `areas`(Array, 선택 사항) 필드를 가짐. |

<br>

### 데이터 예시

**일반 데이터 예시 (`medication.json`)**
```json
{
  "id": "medication-002",
  "category": "medication",
  "name": "비스테로이드성 소염진통제 (NSAIDs)",
  "keywords": ["소염진통제", "이부프로펜", "나프록센", "애드빌"],
  "description": "소염진통제(NSAIDs)는 마지막 복용 후 24시간(1일)이 경과해야 전혈 및 혈장성분헌혈이 가능합니다. 혈소판성분헌혈은 3일(72시간)이 경과해야 합니다.",
  "allowable": false,
  "restriction": {
    "type": "period",
    "periodValue": 1,
    "periodUnit": "day",
    "condition": "마지막 복용일로부터 (혈소판성분헌혈은 3일 경과)"
  }
}
```

**지역 데이터 예시 (`region.json`)**
```json
{
  "id": "region-malaria-asia",
  "category": "region",
  "name": "아시아 말라리아 위험 국가",
  "keywords": ["말라리아", "아시아"],
  "description": "아시아의 특정 국가 및 지역은 말라리아 위험으로 인해 헌혈이 제한될 수 있습니다. 여행 시 1년, 6개월 이상 거주 시 3년간 헌혈이 불가합니다.",
  "allowable": false,
  "restriction": {
    "type": "period_multi",
    "periods": [
      { "value": 1, "unit": "year", "condition": "여행(6개월 미만 체류) 시" },
      { "value": 3, "unit": "year", "condition": "거주(6개월 이상 체류) 시" }
    ]
  },
  "continent": "아시아",
  "risk_areas": null,
  "exception_areas": null,
  "countries": [
    {
      "countryName": "네팔",
      "ruleType": "exclusion",
      "note": "수도, 고지대를 제외한 대부분 지역이 위험하나, 카트만두 및 히말라야 트레킹 코스는 헌혈 가능합니다.",
      "areas": ["카트만두", "히말라야 트레킹 코스"]
    }
  ]
}
```

</details>
<br/>

---

## 📄 면책 조항 (Disclaimer)

본 서비스에서 제공하는 정보는 대한적십자사 혈액관리본부의 자료를 기반으로 한 **일반적인 참고용**이며, 법적 또는 의학적 효력을 갖지 않습니다. 개인의 건강 상태나 특수한 상황에 따라 헌혈 조건이 달라질 수 있으며, 가장 정확한 판단은 **헌혈의 집 현장 문진**을 통해 이루어집니다.

따라서 헌혈 참여 전 반드시 의료 전문가와 상담하시기 바랍니다.

<br/>

---

## 💬 피드백 및 기여

서비스를 사용하시면서 발견한 오류나 개선 아이디어가 있다면 언제든지 GitHub 저장소에 의견을 남겨주세요.

<br/>

## 📜 라이선스 (License)

이 프로젝트는 **GPL-2.0 License**를 따릅니다.