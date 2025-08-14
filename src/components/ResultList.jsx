import React from 'react';
import ResultItem from './ResultItem';
import { Box, Typography } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

const ResultList = React.memo(({
  results,
  query,
  baseDate,
  formatDate,
  totalResultsCount,
}) => {
  if (query && totalResultsCount === 0) {
    return (
      <Box
        className="no-result"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 8,
          textAlign: 'center',
        }}
      >
        <SearchOffRoundedIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
        <Typography variant="h6" component="p" sx={{ mt: 2, fontWeight: 'bold' }}>
          일치하는 검색 결과가 없습니다.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          오타가 있는지 확인하거나 다른 검색어로 다시 시도해보세요.
        </Typography>
      </Box>
    );
  }

  return (
    <ul className="result-list list-none mt-8 flex flex-col items-center space-y-4">
      {results.map((item) => (
        <ResultItem
          key={item.name}
          item={item}
          baseDate={baseDate}
          formatDate={formatDate}
        />
      ))}
    </ul>
  );
});

export default ResultList;
