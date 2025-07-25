import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  expect(inputElement).toBeInTheDocument();
});
