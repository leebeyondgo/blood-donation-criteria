import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsPerPage,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          이전
        </Button>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => onPageChange(number)}
            disabled={currentPage === number}
          >
            {number}
          </Button>
        ))}
        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          다음
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Pagination;
