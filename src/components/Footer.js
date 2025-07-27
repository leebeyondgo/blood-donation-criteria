import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 mt-8 py-6 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400 space-y-3">
        <p>
          본 애플리케이션에서 제공하는 정보는 참고용이며, 의학적 진단이나 전문적인 상담을 대체할 수 없습니다. 실제 헌혈 가능 여부는 현장 문진을 통해 최종 결정됩니다.
        </p>
        <div className="flex justify-center items-center space-x-4">
          <a
            href="https://github.com/leebeyondgo/blood-donation-criteria"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            피드백 및 기여
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
        <p>© 2025 Blood Donation Criteria. All rights reserved.</p>
        <p>GPL-2.0 license</p>
      </div>
    </footer>
  );
};

export default Footer;
