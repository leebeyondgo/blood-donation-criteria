import React, { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Collapse,
  Typography,
  useTheme,
} from '@mui/material';
import {
  EventAvailableRounded,
  CheckCircleRounded,
  CancelRounded,
  InfoRounded,
  ExpandMore as ExpandMoreIcon,
  LabelImportantRounded,
} from '@mui/icons-material';

const ResultItem = React.memo(({ item, baseDate, formatDate }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    name,
    category,
    description,
    allowable,
    restriction,
    restrictionType,
    restrictionPeriodDays,
    condition,
    isException,
    note,
    matchedKeyword,
  } = item;

  const getStatusInfo = () => {
    if (isException) {
      return {
        message: '예외적으로 가능',
        color: 'success.main',
        Icon: CheckCircleRounded,
      };
    }
    if (allowable) {
      return {
        message: '가능',
        color: 'success.main',
        Icon: CheckCircleRounded,
      };
    }
    if (restrictionType === 'permanent') {
      return {
        message: '영구 불가',
        color: 'error.main',
        Icon: CancelRounded,
      };
    }
    if (restrictionPeriodDays > 0) {
      const eligibilityDate = new Date(baseDate);
      eligibilityDate.setDate(
        eligibilityDate.getDate() + restrictionPeriodDays
      );
      return {
        message: `${formatDate(eligibilityDate)}부터 가능`,
        color: 'warning.main',
        Icon: EventAvailableRounded,
      };
    }
    return {
      message: condition || '의사와의 상담 후 가능',
      color: 'info.main',
      Icon: InfoRounded,
    };
  };

  const status = getStatusInfo();
  const periodText =
    restriction && restriction.periodValue > 0
      ? `제한 기간: ${restriction.periodValue}${
          {
            day: '일',
            week: '주',
            month: '개월',
            year: '년',
          }[restriction.periodUnit] || ''
        }`
      : null;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      variant="elevation"
      elevation={theme.palette.mode === 'light' ? 0 : 1}
    >
      <CardActionArea onClick={() => setIsExpanded(!isExpanded)}>
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="body1"
                component="strong"
                sx={{ fontWeight: 'bold' }}
              >
                {name}
              </Typography>
              <Chip
                label={category}
                size="small"
                sx={{
                  ml: 1,
                  verticalAlign: 'middle',
                  fontSize: '0.75rem',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.secondary.main
                      : theme.palette.secondary.dark,
                  color: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.secondary.contrastText
                      : theme.palette.secondary.contrastText,
                }}
              />
            </Box>
            <ExpandMoreIcon
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                color: 'text.secondary',
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
              color: status.color,
            }}
          >
            <status.Icon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {status.message}
            </Typography>
          </Box>

          {periodText && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
            >
              {periodText}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0, pb: 2, px: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          {matchedKeyword && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                mt: 1,
              }}
            >
              <LabelImportantRounded
                sx={{ mr: 0.5, fontSize: '1rem', color: 'inherit' }}
              />
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                일치 키워드: {matchedKeyword}
              </Typography>
            </Box>
          )}
          {note && (
            <Typography
              variant="body2"
              color="info.main"
              sx={{ mt: 1, fontStyle: 'italic' }}
            >
              참고: {note}
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ResultItem;
