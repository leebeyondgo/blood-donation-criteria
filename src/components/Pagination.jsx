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
        color="secondary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: theme.palette.text.secondary,
          },
          '& .Mui-selected': {
            backgroundColor:
              theme.palette.mode === 'light'
                ? `${theme.palette.secondary.main} !important`
                : 'transparent !important',
            color:
              theme.palette.mode === 'light'
                ? `${theme.palette.common.white} !important`
                : theme.palette.common.white,
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
};

export default Pagination;
