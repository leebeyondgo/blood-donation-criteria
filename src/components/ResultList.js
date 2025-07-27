import React from 'react';
import ResultItem from './ResultItem';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const ResultList = ({
  results,
  query,
  baseDate,
  formatDate,
  totalResultsCount,
}) => {
  if (query && totalResultsCount === 0) {
    return (
      <div className="no-result flex flex-col items-center justify-center p-8">
        <SearchOffIcon style={{ fontSize: 60, color: '#9e9e9e' }} />
        <p className="mt-4 text-lg font-bold text-gray-700">
          일치하는 검색 결과가 없습니다.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          다른 검색어를 입력하거나 오타가 있는지 확인해보세요.
        </p>
      </div>
    );
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
