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
      {/*
        1. 메인 콘텐츠 컨테이너에 'relative'를 추가해 위치 기준점으로 만듭니다.
           이제 이 안의 'absolute' 요소들은 이 div를 기준으로 움직입니다.
      */}
      <div className="App relative text-center p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
        {/*
          2. 버튼에 'absolute'를 주고 우측 상단으로 보냅니다.
             padding 값과 동일하게 'top-4 right-4' (sm 이상에서는 'top-8 right-8')를 주어
             콘텐츠 영역의 우측 상단에 예쁘게 위치하도록 합니다.
        */}
        <IconButton
          onClick={toggleTheme}
          aria-label="테마 토글"
          className="absolute top-4 right-4 sm:top-8 sm:right-8"
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </IconButton>

        {/*
          3. 제목은 'text-center' 클래스 덕분에 여전히 중앙 정렬을 유지합니다.
        */}
        <h1 className="text-2xl font-bold">헌혈 제한 조건 검색</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <FiSearch />
            <TextField
              variant="outlined"
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
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

        <FormControl
          size="small"
          aria-label="카테고리 필터"
          className={query ? 'invisible mt-3 sm:mt-0' : 'mt-3 sm:mt-0'}
        >
          <InputLabel shrink>카테고리 필터</InputLabel>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={filterType}
            onChange={(e, newType) => {
              setFilterType(newType || '');
            }}
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
