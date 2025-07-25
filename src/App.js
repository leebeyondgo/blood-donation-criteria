import { useState, useMemo, useEffect, createContext } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
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
    // if (!query && !filterType) return [];
    const lower = query.toLowerCase();
    return allData.filter((item) => {
      if (filterType && item.type !== filterType) return false;
      if (!query) return true;
      const nameMatch = item.name.toLowerCase().includes(lower);
      const aliasMatch = (item.aliases || []).some((alias) =>
        alias.toLowerCase().includes(lower)
      );
      return nameMatch || aliasMatch;
    });
  }, [query, filterType]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App relative text-center p-8 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">헌혈 제한 조건 검색</h1>

        <button
          onClick={toggleTheme}
          aria-label="테마 토글"
          className="theme-toggle absolute top-4 right-4 p-2 inline-flex items-center justify-center"
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className="flex justify-center items-center gap-3">
          <FiSearch />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-style"
          />
        </div>

        <input
          type="date"
          className="input-style date-input"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
          placeholder="기준 날짜 선택"
        />

        <select
          aria-label="카테고리 필터"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-style w-full max-w-xs"
        >
          <option value="">전체</option>
          <option value="질병">질병</option>
          <option value="지역">지역</option>
          <option value="약물">약물</option>
          <option value="백신">백신</option>
          <option value="기타">기타</option>
        </select>


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
    </ThemeContext.Provider>
  );
}

export default App;
