import React from 'react';
import ResultItem from './ResultItem';

const ResultList = ({
  results,
  query,
  baseDate,
  formatDate,
  totalResultsCount,
}) => {
  if (query && totalResultsCount === 0) {
    return <li className="no-result">검색 결과가 없습니다.</li>;
  }

  return (
    <ul className="result-list list-none mt-8 flex flex-col items-center space-y-4">
      {results.map((item) => (
        <ResultItem
          key={item.id}
          item={item}
          baseDate={baseDate}
          formatDate={formatDate}
        />
      ))}
    </ul>
  );
};

export default ResultList;
