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
