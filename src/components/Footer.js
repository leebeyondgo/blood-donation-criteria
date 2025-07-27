import React from 'react';
import { Box, useTheme } from '@mui/material';
import { MailOutlineRounded } from '@mui/icons-material'; // 이메일 아이콘 import

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.default',
        color: 'text.secondary',
        mt: 8,
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm space-y-3">
        <p>
          본 애플리케이션에서 제공하는 정보는 참고용이며, 의학적 진단이나 전문적인 상담을 대체할 수 없습니다. 실제 헌혈 가능 여부는 현장 문진을 통해 최종 결정됩니다.
        </p>
        <div className="flex justify-center items-center space-x-4">
          <a
            href="https://github.com/leebeyondgo/blood-donation-criteria/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            피드백 및 기능 제안
          </a>
          <a
            href="https://www.bloodinfo.net/main.do"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            대한적십자사 혈액관리본부
          </a>
        </div>
        
        {/* 이메일 피드백 링크 */}
        <div className="flex justify-center items-center space-x-1">
          <MailOutlineRounded sx={{ fontSize: '1rem' }} />
          <a href="mailto:won31080@gmail.com" className="hover:underline">
            won31080@gmail.com
          </a>
        </div>

        <p className="pt-2 text-xs"> {/* 저작권/라이선스 정보와 위쪽 여백 */}
          © 2025 Blood Donation Criteria. GPL-2.0 License.
        </p>
      </div>
    </Box>
  );
};

export default Footer;