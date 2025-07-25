import { useState, useMemo, useEffect, createContext } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import {
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
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
    return allData.filter((item) => {
      if (!query) {
        if (filterType && item.type !== filterType) return false;
        return true;
      }

      const nameMatch = item.name.toLowerCase().includes(lower);
      const aliasMatch = (item.aliases || []).some((alias) =>
        alias.toLowerCase().includes(lower)
      );
      return nameMatch || aliasMatch;
    });
  }, [query, filterType]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App relative text-center p-8 space-y-6 max-w-3xl mx-auto">
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

        <ToggleButtonGroup
          exclusive
          size="small"
          value={filterType}
          onChange={(e, newType) => {
            if (newType !== null) setFilterType(newType);
          }}
          aria-label="카테고리 필터"
          className={query ? 'invisible mt-3 sm:mt-0' : 'mt-3 sm:mt-0'}
        >
          <ToggleButton value="">전체</ToggleButton>
          <ToggleButton value="질병">질병</ToggleButton>
          <ToggleButton value="지역">지역</ToggleButton>
          <ToggleButton value="약물">약물</ToggleButton>
          <ToggleButton value="백신">백신</ToggleButton>
          <ToggleButton value="기타">기타</ToggleButton>
        </ToggleButtonGroup>



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
              <li key={item.id} className="result-item">
                <strong>{item.name}</strong> ({item.type}) - {item.restriction}
                <div className="period-text">{periodText}</div>
                <div className={`eligible-date ${colorClass}`}>{message}</div>
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
