import React, { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Collapse,
  Typography,
} from '@mui/material';
import {
  EventAvailableOutlined,
  CheckCircleOutline,
  CancelOutlined,
  InfoOutlined,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const ResultItem = ({ item, baseDate, formatDate }) => {
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
  } = item;

  const getStatusInfo = () => {
    if (allowable) {
      return {
        message: '가능',
        color: 'success.main',
        Icon: CheckCircleOutline,
      };
    }
    if (restrictionType === 'permanent') {
      return {
        message: '영구 불가',
        color: 'error.main',
        Icon: CancelOutlined,
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
        Icon: EventAvailableOutlined,
      };
    }
    return {
      message: condition || '의사와의 상담 후 가능',
      color: 'info.main',
      Icon: InfoOutlined,
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
        border: '1px solid',
        borderColor: 'divider',
      }}
      variant="outlined"
    >
      <CardActionArea onClick={() => setIsExpanded(!isExpanded)}>
        <CardContent>
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
                variant="h6"
                component="strong"
                sx={{ fontWeight: 'bold' }}
              >
                {name}
              </Typography>
              <Chip
                label={category}
                size="small"
                sx={{ ml: 1, verticalAlign: 'middle' }}
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
              mt: 1.5,
              color: status.color,
            }}
          >
            <status.Icon sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {status.message}
            </Typography>
          </Box>

          {periodText && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {periodText}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ResultItem;
