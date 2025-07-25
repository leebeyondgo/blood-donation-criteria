import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// 검색어 입력 시 해당 제한 조건이 표시된다
it('검색어 입력 시 해당 제한 조건이 표시된다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, 'HCV');
  expect(
    screen.getByText(/감염 이력 있는 경우 영구 헌혈 금지/i)
  ).toBeInTheDocument();
});

// 양성 제한 기간이 있는 항목은 기간 텍스트와 날짜를 계산한다
it('양성 제한 기간이 있는 항목은 기간 텍스트와 날짜를 계산한다', async () => {
  render(<App />);
  const queryInput = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  const dateInput = screen.getByLabelText('이벤트 날짜');
  await userEvent.type(dateInput, '2024-01-01');
  await userEvent.type(queryInput, 'Doxy');
  expect(screen.getByText('금지 기간: 7일')).toBeInTheDocument();
  expect(screen.getByText('2024년01월08일')).toBeInTheDocument();
});

// 음수 제한 기간은 영구 금지와 헌혈 불가로 표시한다
it('음수 제한 기간은 영구 금지와 헌혈 불가로 표시한다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, 'HCV');
  expect(screen.getByText('영구 금지')).toBeInTheDocument();
  expect(screen.getByText('헌혈 불가')).toBeInTheDocument();
});

// 제한 기간이 0이면 금지 기간 없음과 즉시 가능으로 표시한다
it('제한 기간이 0이면 금지 기간 없음과 즉시 가능으로 표시한다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, '코로나19 백신');
  expect(screen.getByText('금지 기간 없음')).toBeInTheDocument();
  expect(screen.getByText('즉시 가능')).toBeInTheDocument();
});

// 테마 토글 버튼 클릭 시 document 클래스가 변경된다
it('테마 토글 버튼 클릭 시 document 클래스가 변경된다', async () => {
  localStorage.clear();
  render(<App />);
  const button = screen.getByRole('button', { name: /테마 토글/i });
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await userEvent.click(button);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  await userEvent.click(button);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
});
