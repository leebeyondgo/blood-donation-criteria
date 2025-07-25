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
      <ul className="result-list">
        {results.map((item, index) => (
          <li key={index} className="result-item">
            <strong>{item.name}</strong> ({item.type}) - {item.restriction}
          </li>
        ))}
        {query && results.length === 0 && (
          <li className="no-result">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
