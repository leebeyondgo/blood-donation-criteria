import React from 'react';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
          variant={i === currentPage ? 'contained' : 'outlined'}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center my-4">
      <IconButton onClick={handlePrevious} disabled={currentPage === 1}>
        <NavigateBeforeIcon />
      </IconButton>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        {renderPageNumbers()}
      </ButtonGroup>
      <IconButton onClick={handleNext} disabled={currentPage === totalPages}>
        <NavigateNextIcon />
      </IconButton>
    </div>
  );
};

export default Pagination;
