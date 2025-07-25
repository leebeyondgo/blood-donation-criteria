import { useState, useMemo, useEffect, createContext } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import dataA from './data/donation_a.json';
import dataB from './data/donation_b.json';
import dataC from './data/donation_c.json';
import dataD from './data/donation_d.json';
import dataE from './data/donation_e.json';

export const ThemeContext = createContext();

const allData = [...dataA, ...dataB, ...dataC, ...dataD, ...dataE];

function App() {
  const [query, setQuery] = useState('');
  const [eventDate, setEventDate] = useState('');

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  };

  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const results = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return allData.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(lower);
      const aliasMatch = (item.aliases || []).some((alias) =>
        alias.toLowerCase().includes(lower)
      );
      return nameMatch || aliasMatch;
    });
  }, [query]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App text-center p-5 space-y-4">
        <h1 className="text-2xl font-bold">헌혈 제한 조건 검색</h1>

        <button
          onClick={toggleTheme}
          aria-label="테마 토글"
          className="theme-toggle border rounded p-2 inline-flex items-center justify-center"
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className="flex justify-center items-center gap-2">
          <FiSearch />
          <input
            className="search-input border p-2 w-80 max-w-full"
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <input
          className="date-input border p-2"
          type="date"
          aria-label="이벤트 날짜"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <ul className="result-list list-none mt-5 flex flex-col items-center space-y-3">
          {results.map((item) => {
            const period = item.restriction_period_days;
            let periodText;
            if (period < 0) {
              periodText = '영구 금지';
            } else if (period === 0) {
              periodText = '금지 기간 없음';
            } else {
              periodText = `금지 기간: ${period}일`;
            }

            let message;
            if (period < 0) {
              message = '헌혈 불가';
            } else if (period === 0) {
              message = '즉시 가능';
            } else {
              const base = eventDate ? new Date(eventDate) : new Date();
              base.setDate(base.getDate() + period);
              message = formatDate(base);
            }

            return (
              <li key={item.id} className="result-item">
                <strong>{item.name}</strong> ({item.type}) - {item.restriction}
                <div className="period-text">{periodText}</div>
                <div className="eligible-date">{message}</div>
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
