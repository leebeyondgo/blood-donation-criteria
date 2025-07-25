import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('검색어 입력 시 해당 제한 조건이 표시된다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, 'HCV');
  expect(
    screen.getByText(/감염 이력 있는 경우 영구 헌혈 금지/i)
  ).toBeInTheDocument();
});

test('테마 토글 버튼 클릭 시 document 클래스가 변경된다', async () => {
  localStorage.clear();
  render(<App />);
  const button = screen.getByRole('button', { name: /테마 토글/i });
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await userEvent.click(button);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  await userEvent.click(button);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
});
