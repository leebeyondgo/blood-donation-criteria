import { useState, useMemo, useContext, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
} from '@mui/material'; // Brightness 아이콘 import 제거
import {
  Brightness7Rounded, // 아이콘은 여기서만 가져옵니다.
  Brightness4Rounded,
} from '@mui/icons-material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { ThemeContext } from './contexts/ThemeContext';
import ResultList from './components/ResultList';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import diseaseData from './data/disease.json';
import regionData from './data/region.json';
import medicationData from './data/medication.json';
import vaccinationData from './data/vaccination.json';
import etcData from './data/etc.json';
import procedureData from './data/procedure.json';

const categoryMap = {
  disease: '질병',
  region: '지역',
  medication: '약물',
  vaccination: '백신',
  procedure: '시술',
  region_travel: '지역',
  region_domestic_malaria: '지역',
  region_vcjd: '지역',
  region_malaria: '지역',
  etc: '기타',
};

const processedRegionData = regionData.flatMap((region) => {
  if (region.countries) {
    // Handle malaria risk countries with specific areas
    return region.countries.flatMap((country) => {
      if (country.ruleType === 'exclusion' && country.areas) {
        return country.areas.map((area) => ({
          category: 'region',
          name: `${country.countryName} - ${area}`,
          keywords: [country.countryName, area, '말라리아', region.name],
          description: `해당 국가는 말라리아 위험 지역이지만, ${area} 지역은 예외적으로 헌혈이 가능합니다. ${country.note ? `(${country.note})` : ''}`,
          allowable: true,
          isException: true,
          restriction: { type: 'none', periodValue: 0, periodUnit: 'day', condition: '' },
        }));
      } else if (country.ruleType === 'inclusion') {
        // Handle inclusion type, where the whole country is a risk area
        return [{
          category: 'region',
          name: country.countryName,
          keywords: [country.countryName, '말라리아', region.name],
          description: `${country.countryName} 전 지역이 말라리아 위험 지역입니다. ${country.note ? `(${country.note})` : ''}`,
          allowable: false,
          restriction: region.restriction, // Use the region's restriction for inclusion
        }];
      }
      return [];
    });
  } else {
    // Handle general region items (e.g., general overseas travel, domestic malaria)
    return [{
      ...region,
      category: 'region', // Ensure category is explicitly set
    }];
  }
});

const baseData = [
  ...diseaseData,
  ...medicationData,
  ...vaccinationData,
  ...procedureData,
  ...etcData,
  ...processedRegionData, // Use the pre-processed region data
];

const processedData = baseData.map((item) => {
  const { restriction, category, countries } = item;
  let restrictionType = 'default';
  let restrictionPeriodDays = 0;
  let condition = '';
  let description = item.description || '';

  // 국가 목록이 있는 경우, description에 국가명을 추가합니다.
  // This part might need adjustment if 'countries' is no longer directly on 'item' for all types
  // For region data, 'countries' is now handled in processedRegionData
  if (countries && countries.length > 0 && category !== 'region') { // Only add country names if not a region item
    const countryNames = countries.map((c) => c.countryName).join(', ');
    description += ` (대상 국가: ${countryNames})`;
  }

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
    description,
    category: categoryMap[category] || '기타',
    restrictionType,
    restrictionPeriodDays,
    condition,
  };
});

const allData = [...processedData]; // malariaExceptionData is now integrated into processedRegionData

function App() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [baseDate, setBaseDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [query, filterType]);

  const formatDate = useCallback((date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  }, []);

  const results = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery) {
      // 검색어가 있으면 카테고리 필터 없이 전체 데이터에서 검색
      return allData.reduce((acc, item) => {
        const lowerName = item.name.toLowerCase();

        if (lowerName.includes(lowerQuery)) {
          acc.push({ ...item, matchedKeyword: item.name });
        } else {
          const matchedKeyword = (item.keywords || []).find((k) =>
            k.toLowerCase().includes(lowerQuery)
          );
          if (matchedKeyword) {
            acc.push({ ...item, matchedKeyword });
          }
        }
        return acc;
      }, []);
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
              {theme === 'light' ? <Brightness4Rounded /> : <Brightness7Rounded />}
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
              <ToggleButton value="시술">시술</ToggleButton>
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

        <div className="mt-8">
          <Pagination
            totalPages={Math.ceil(results.length / ITEMS_PER_PAGE)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <Footer />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
