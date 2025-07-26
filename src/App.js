import { useState, useMemo, useEffect, createContext } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import {
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import diseaseData from './data/disease.json';
import regionData from './data/region.json';
import medicationData from './data/medication.json';
import vaccinationData from './data/vaccination.json';
import etcData from './data/etc.json';

export const ThemeContext = createContext();

const allData = [
  ...diseaseData,
  ...regionData,
  ...medicationData,
  ...vaccinationData,
  ...etcData,
];

function App() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [baseDate, setBaseDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  };

  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const systemChange = () => {
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setTheme(media.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', systemChange);
    return () => media.removeEventListener('change', systemChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const results = useMemo(() => {
    const lower = query.toLowerCase();
    if (!query) {
      return allData
        .filter((item) => !filterType || item.type === filterType)
        .map((item) => ({ ...item, matchInfo: null }));
    }

    return allData
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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App relative text-center p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">헌혈 제한 조건 검색</h1>

        <IconButton
          onClick={toggleTheme}
          aria-label="테마 토글"
          className="theme-toggle absolute top-4 right-4"
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </IconButton>

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
              if (newType !== null) setFilterType(newType);
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



        <ul className="result-list list-none mt-8 flex flex-col items-center space-y-4">
          {results.map((item) => {
            const period = item.restriction_period_days;
            const type = item.restriction_type;

            let periodText;
            if (type === 'permanent') {
              periodText = '영구 금지';
            } else if (type === 'conditional') {
              periodText = '조건부 금지';
            } else if (period === 0) {
              periodText = '금지 기간 없음';
            } else if (period > 0) {
              periodText = `금지 기간: ${period}일`;
            } else {
              periodText = '영구 금지';
            }

            let message;
            if (type === 'permanent') {
              message = '헌혈 불가';
            } else if (type === 'conditional') {
              message = '완치 후 가능';
            } else if (period === 0) {
              message = '즉시 가능';
            } else if (period > 0) {
              const base = new Date(baseDate);
              base.setDate(base.getDate() + period);
              message = formatDate(base);
            } else {
              message = '헌혈 불가';
            }

            const colorClass = message === '헌혈 불가'
              ? 'text-red-500 dark:text-red-400'
              : 'text-green-500 dark:text-green-400';

            return (
              <li
                key={item.id}
                className="result-item flex flex-col p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <strong className="font-bold text-lg">{item.name}</strong>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({item.type}) - {item.restriction}
                    </span>
                    <div className="period-text text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {periodText}
                    </div>
                  </div>
                  <div className={`eligible-date ${colorClass} font-semibold`}>
                    {message}
                  </div>
                </div>
                {item.matchInfo && (
                  <div className="match-info mt-2">
                    {item.matchInfo.map((match, i) => (
                      <span key={i} className="match-tag">
                        {match.value}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}

          {query && results.length === 0 && (
            <li className="no-result">검색 결과가 없습니다.</li>
          )}
        </ul>
      </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
