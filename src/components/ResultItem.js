import React from 'react';
import { Tooltip } from '@mui/material';

const ResultItem = ({ item, baseDate, formatDate }) => {
  const {
    restrictionPeriodDays,
    restrictionType,
    condition,
    name,
    description,
    matchInfo,
    allowable,
    restriction,
    category,
  } = item;

  let periodText = '';
  if (restrictionType === 'permanent') {
    periodText = '영구 헌혈 불가';
  } else if (restrictionPeriodDays > 0) {
    periodText = `제한 기간: ${restriction.periodValue}${
      restriction.periodUnit === 'day'
        ? '일'
        : restriction.periodUnit === 'week'
        ? '주'
        : restriction.periodUnit === 'month'
        ? '개월'
        : '년'
    }`;
  }

  let eligibilityMessage;
  let colorClass;

  if (allowable) {
    eligibilityMessage = '가능';
    colorClass = 'text-green-500 dark:text-green-400';
  } else if (restrictionType === 'permanent') {
    eligibilityMessage = '불가';
    colorClass = 'text-red-500 dark:text-red-400';
  } else if (restrictionPeriodDays > 0) {
    const eligibilityDate = new Date(baseDate);
    eligibilityDate.setDate(eligibilityDate.getDate() + restrictionPeriodDays);
    eligibilityMessage = `${formatDate(eligibilityDate)}부터 가능`;
    colorClass = 'text-orange-500 dark:text-orange-400';
  } else {
    eligibilityMessage = '조건부 가능';
    colorClass = 'text-blue-500 dark:text-blue-400';
  }

  return (
    <li className="result-item flex flex-col p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 w-full">
      <div className="flex justify-between items-start">
        <div className="flex-grow text-left">
          <strong className="font-bold text-lg">{name}</strong>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({category})
          </span>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {description.length > 50 ? (
              <Tooltip title={description} arrow>
                <span>{`${description.substring(0, 50)}...`}</span>
              </Tooltip>
            ) : (
              description
            )}
          </div>
          {periodText && (
            <div className="period-text text-sm text-gray-600 dark:text-gray-300 mt-1">
              {periodText}
            </div>
          )}
        </div>
        <div
          className={`eligible-date ${colorClass} font-semibold whitespace-nowrap`}
        >
          {eligibilityMessage}
        </div>
      </div>
      {matchInfo && (
        <div className="match-info mt-2 text-left">
          {matchInfo.map((match, i) => (
            <span key={i} className="match-tag">
              {match.value}
            </span>
          ))}
        </div>
      )}
    </li>
  );
};

export default ResultItem;
