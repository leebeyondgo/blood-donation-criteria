import { useState, useMemo, useContext } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import {
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { ThemeContext } from './contexts/ThemeContext';
import ResultList from './components/ResultList';
import diseaseData from './data/disease.json';
import regionData from './data/region.json';
import medicationData from './data/medication.json';
import vaccinationData from './data/vaccination.json';
import etcData from './data/etc.json';

const categoryMap = {
  disease: '질병',
  region: '지역',
  medication: '약물',
  vaccination: '백신',
  malaria_domestic: '지역',
  malaria_international: '지역',
  vcjd: '지역',
  etc: '기타',
};

const allData = [
  ...diseaseData,
  ...medicationData,
  ...vaccinationData,
  ...etcData,
  ...regionData,
].map((item) => {
  const { restriction, category } = item;
  let restrictionType = 'default';
  let restrictionPeriodDays = 0;
  let condition = '';

  if (restriction) {
    restrictionType = restriction.type;
    condition = restriction.condition || '';

    switch (restriction.periodUnit) {
      case 'day':
        restrictionPeriodDays = restriction.periodValue;
        break;
      case 'week':
        restrictionPeriodDays = restriction.periodValue * 7;
        break;
      case 'month':
        restrictionPeriodDays = restriction.periodValue * 30; // Approximation
        break;
      case 'year':
        restrictionPeriodDays = restriction.periodValue * 365; // Approximation
        break;
      case 'permanent':
        restrictionPeriodDays = -1;
        break;
      default:
        restrictionPeriodDays = 0;
    }
  } else {
    restrictionType = 'none';
  }

  return {
    ...item,
    category: categoryMap[category] || '기타',
    restrictionType,
    restrictionPeriodDays,
    condition,
  };
});

function App() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [baseDate, setBaseDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const { theme, toggleTheme } = useContext(ThemeContext);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  };

  const results = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery) {
      return filterType
        ? allData.filter((item) => item.category === filterType)
        : allData;
    }

    const filteredData = allData
      .map((item) => {
        const matchInfo = [];
        const lowerName = item.name.toLowerCase();
        const keywords = (item.keywords || []).map((k) => k.toLowerCase());

        // 1. 기본 정보 검색 (name, keywords)
        if (lowerName.includes(lowerQuery)) {
          matchInfo.push({ type: 'name', value: item.name });
        }
        keywords.forEach((keyword) => {
          if (keyword.includes(lowerQuery)) {
            matchInfo.push({ type: 'keyword', value: keyword });
          }
        });

        // 2. 지역(region) 데이터 특별 처리
        if (item.category === '지역' && item.countries) {
          const queryParts = lowerQuery.split(' ').filter(Boolean);
          const countryQuery = queryParts[0] || '';
          const areaQuery = queryParts.slice(1).join(' ') || queryParts[0];

          item.countries.forEach((country) => {
            const lowerCountryName = country.countryName.toLowerCase();
            const lowerAreas = country.areas.map((a) => a.toLowerCase());

            const countryMatch = lowerCountryName.includes(countryQuery);
            const areaMatch = lowerAreas.some((area) =>
              area.includes(areaQuery)
            );

            if (country.ruleType === 'exclusion') {
              // Exclusion: 국가가 위험, 특정 지역만 안전
              if (countryMatch && areaMatch) {
                // "태국 방콕" -> 방콕은 예외 지역 -> 헌혈 가능
                const newItem = {
                  ...item,
                  name: `${country.countryName} - ${
                    country.areas.find((area) =>
                      area.toLowerCase().includes(areaQuery)
                    ) || areaQuery
                  }`,
                  allowable: true,
                  isException: true,
                  note: country.note,
                  restriction: {},
                };
                matchInfo.push(newItem);
              } else if (countryMatch && queryParts.length > 1 && !areaMatch) {
                // "태국 시골" -> 시골은 예외 지역 아님 -> 헌혈 불가
                matchInfo.push({ type: 'country', value: country.countryName });
              } else if (
                !countryMatch &&
                lowerAreas.some((area) => area.includes(lowerQuery))
              ) {
                // "방콕" -> 방콕은 예외 지역 -> 헌혈 가능
                const matchedArea = country.areas.find((area) =>
                  area.toLowerCase().includes(lowerQuery)
                );
                const newItem = {
                  ...item,
                  name: `${country.countryName} - ${matchedArea}`,
                  allowable: true,
                  isException: true,
                  note: country.note,
                  restriction: {},
                };
                matchInfo.push(newItem);
              } else if (countryMatch && queryParts.length === 1) {
                // "태국" -> 전체가 위험함을 표시
                matchInfo.push({ type: 'country', value: country.countryName });
              }
            } else if (country.ruleType === 'inclusion') {
              // Inclusion: 국가 자체는 안전, 특정 지역만 위험
              if (countryMatch && areaMatch) {
                // "중국 윈난성" -> 윈난성은 위험 지역 -> 헌혈 불가
                matchInfo.push({ type: 'country', value: country.countryName });
              } else if (
                !countryMatch &&
                lowerAreas.some((area) => area.includes(lowerQuery))
              ) {
                // "윈난성" -> 위험 지역 -> 헌혈 불가
                matchInfo.push({ type: 'country', value: country.countryName });
              }
            }
          });
        }

        const specialMatches = matchInfo.filter((m) => m.isException);
        if (specialMatches.length > 0) {
          return specialMatches;
        }

        if (matchInfo.length > 0) {
          return { ...item, matchInfo: 'default' };
        }

        return null;
      })
      .flat() // 중첩된 배열을 평탄화
      .filter(Boolean);

    // 중복 제거
    const uniqueResults = filteredData.reduce((acc, current) => {
      if (!acc.find((item) => item.id === current.id && item.name === current.name)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return filterType
      ? uniqueResults.filter((item) => item.category === filterType)
      : uniqueResults;
  }, [query, filterType]);

  return (
    <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
        {/*
          가장 안정적인 Grid 레이아웃을 사용해 문제를 해결합니다.
          1. 'grid'와 'grid-cols-3'로 헤더 영역을 3개의 컬럼으로 나눕니다.
          2. 'items-center'로 내용물을 수직 중앙 정렬합니다.
        */}
        <header className="grid grid-cols-3 items-center">
          {/* 1번(왼쪽) 컬럼: 비워둠으로써 2번 컬럼인 제목이 중앙에 오도록 합니다. */}
          <div></div>

          {/* 2번(중앙) 컬럼: 제목을 중앙에 배치합니다. */}
          <h1 className="text-lg sm:text-xl font-bold text-center">
            헌혈 조건 검색
          </h1>

          {/* 3번(오른쪽) 컬럼: 버튼을 오른쪽 끝으로 보냅니다. */}
          <div className="flex justify-end">
            <IconButton
              onClick={toggleTheme}
              aria-label="테마 토글"
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </IconButton>
          </div>
        </header>

        {/*
          모바일 환경에서의 검색창과 날짜 선택창의 레이아웃을 개선합니다.
          1. 'flex-wrap'을 추가해 내용이 넘칠 때 다음 줄로 자연스럽게 넘어가게 합니다.
          2. 검색창('flex-grow')이 가능한 많은 공간을 차지하게 하고, 날짜 선택창은 기존 크기를 유지하게 합니다.
        */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3 flex-grow">
            <FiSearch />
            <TextField
              variant="outlined"
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
              className="flex-grow" // TextField가 남은 공간을 모두 차지하도록
            />
          </div>
          <TextField
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            size="small"
            inputProps={{ 'aria-label': '기준 날짜' }}
          />
        </div>

        {/*
          카테고리 필터의 UI를 개선합니다.
          1. 'flex-wrap'을 사용해 버튼들이 화면 크기에 맞춰 자동으로 줄바꿈되도록 합니다.
          2. 'justify-center'를 적용해 필터를 수평 중앙 정렬합니다.
        */}
        <div className="flex justify-center">
          <FormControl
            size="small"
            aria-label="카테고리 필터"
            className={`flex-wrap ${
              query ? 'invisible' : ''
            } mt-3 sm:mt-0`}
          >
            <InputLabel shrink>카테고리 필터</InputLabel>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={filterType}
              onChange={(e, newType) => {
                setFilterType(newType || '');
              }}
              className="flex-wrap" // 버튼 그룹 자체도 줄바꿈을 허용합니다.
            >
              <ToggleButton value="">전체</ToggleButton>
              <ToggleButton value="질병">질병</ToggleButton>
              <ToggleButton value="지역">지역</ToggleButton>
              <ToggleButton value="약물">약물</ToggleButton>
              <ToggleButton value="백신">백신</ToggleButton>
              <ToggleButton value="기타">기타</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </div>

        <ResultList
          results={results}
          query={query}
          baseDate={baseDate}
          formatDate={formatDate}
        />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
