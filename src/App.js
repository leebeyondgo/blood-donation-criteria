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
import Pagination from './components/Pagination';
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
  region_travel: '지역',
  region_domestic_malaria: '지역',
  region_vcjd: '지역',
  region_malaria: '지역',
  etc: '기타',
};

const baseData = [
  ...diseaseData,
  ...medicationData,
  ...vaccinationData,
  ...etcData,
  ...regionData,
];

const processedData = baseData.map((item) => {
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

// 말라리아 예외 지역 데이터 미리 생성
const malariaExceptionData = [];
regionData.forEach((region) => {
  if (region.id.includes('malaria') && region.countries) {
    region.countries.forEach((country) => {
      if (country.ruleType === 'exclusion') {
        country.areas.forEach((area) => {
          malariaExceptionData.push({
            id: `${region.id}-${country.countryName}-${area}`,
            category: '지역',
            name: `${country.countryName} - ${area}`,
            keywords: [country.countryName, area, '말라리아'],
            description: `해당 국가는 말라리아 위험 지역이지만, ${area} 지역은 예외적으로 헌혈이 가능합니다.`,
            allowable: true,
            isException: true,
            note: country.note,
            restriction: {},
            restrictionType: 'none',
            restrictionPeriodDays: 0,
            condition: '',
          });
        });
      }
    });
  }
});

const allData = [...processedData, ...malariaExceptionData];

function App() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [baseDate, setBaseDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const ITEMS_PER_PAGE = 20;

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  };

  const results = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery) {
      // 검색어가 있으면 카테고리 필터 없이 전체 데이터에서 검색
      return allData.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const keywords = (item.keywords || []).map((k) => k.toLowerCase());
        return (
          lowerName.includes(lowerQuery) ||
          keywords.some((k) => k.includes(lowerQuery))
        );
      });
    } else {
      // 검색어가 없으면 기존 로직대로 카테고리 필터 적용
      return filterType
        ? allData.filter((item) => item.category === filterType)
        : allData;
    }
  }, [query, filterType]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage]);

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
                if (newType !== null) {
                  setFilterType(newType);
                }
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
          results={paginatedResults}
          query={query}
          baseDate={baseDate}
          formatDate={formatDate}
          totalResultsCount={results.length}
        />

        {results.length > ITEMS_PER_PAGE && (
          <Pagination
            totalPages={Math.ceil(results.length / ITEMS_PER_PAGE)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <footer className="text-center text-sm text-gray-500 mt-8 py-4 border-t">
          <p>
            <a
              href="https://github.com/your-github/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              피드백 및 기여
            </a>
          </p>
          <p>License: MIT</p>
        </footer>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
