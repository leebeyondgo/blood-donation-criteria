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
    const lower = query.toLowerCase();
    let filteredData = allData;
    if (filterType) {
      filteredData = filteredData.filter((item) => item.category === filterType);
    }
    if (!query) {
      return filteredData.map((item) => ({ ...item, matchInfo: null }));
    }
    return filteredData
      .map((item) => {
        const matchInfo = [];
        if (item.name.toLowerCase().includes(lower)) {
          matchInfo.push({ type: 'name', value: item.name });
        }
        const matchingAliases = (item.aliases || []).filter((alias) =>
          alias.toLowerCase().includes(lower)
        );
        if (matchingAliases.length > 0) {
          matchingAliases.forEach((alias) =>
            matchInfo.push({ type: 'alias', value: alias })
          );
        }
        const matchingKeywords = (item.keywords || []).filter((keyword) =>
          keyword.toLowerCase().includes(lower)
        );
        if (matchingKeywords.length > 0) {
          matchingKeywords.forEach((keyword) =>
            matchInfo.push({ type: 'keyword', value: keyword })
          );
        }
        if (matchInfo.length > 0) {
          return { ...item, matchInfo };
        }
        return null;
      })
      .filter(Boolean);
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
        */}
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
