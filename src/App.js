import { useState, useMemo } from 'react';
import dataA from './data/donation_a.json';
import dataB from './data/donation_b.json';
import dataC from './data/donation_c.json';
import dataD from './data/donation_d.json';
import dataE from './data/donation_e.json';
import './App.css';

const allData = [...dataA, ...dataB, ...dataC, ...dataD, ...dataE];

function App() {
  const [query, setQuery] = useState('');
  const [eventDate, setEventDate] = useState('');

  const formatDate = date => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  };

  const results = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return allData.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(lower);
      const aliasMatch = (item.aliases || []).some(alias =>
        alias.toLowerCase().includes(lower)
      );
      return nameMatch || aliasMatch;
    });
  }, [query]);

  return (
    <div className="App">
      <h1>헌혈 제한 조건 검색</h1>
      <input
        className="search-input"
        type="text"
        placeholder="검색어를 입력하세요"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <input
        className="date-input"
        type="date"
        aria-label="이벤트 날짜"
        value={eventDate}
        onChange={e => setEventDate(e.target.value)}
      />
      <ul className="result-list">
        {results.map((item, index) => {
          const period = item.restriction_period_days;
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
            <li key={index} className="result-item">
              <strong>{item.name}</strong> ({item.type}) - {item.restriction}
              <div className="eligible-date">{message}</div>
            </li>
          );
        })}
        {query && results.length === 0 && (
          <li className="no-result">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
