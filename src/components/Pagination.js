import React from 'react';
import { Pagination as MuiPagination, useTheme } from '@mui/material';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const theme = useTheme();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: theme.palette.text.secondary,
          },
          '& .Mui-selected': {
            backgroundColor: 'transparent !important',
            color: theme.palette.text.secondary,
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
};

export default Pagination;
