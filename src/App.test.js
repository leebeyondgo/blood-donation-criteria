import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// 검색어 입력 시 해당 제한 조건이 표시된다
test('검색어 입력 시 해당 제한 조건이 표시된다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, 'HCV');
  expect(
    screen.getByText(/감염 이력 있는 경우 영구 헌혈 금지/i)
  ).toBeInTheDocument();
});

// 영구 제한 타입은 영구 금지와 헌혈 불가로 표시한다
test('영구 제한 타입은 영구 금지와 헌혈 불가로 표시한다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, 'HCV');
  expect(screen.getByText('영구 금지')).toBeInTheDocument();
  expect(screen.getByText('헌혈 불가')).toBeInTheDocument();
});

// 조건부 제한 타입은 조건부 금지와 완치 후 가능으로 표시한다
test('조건부 제한 타입은 조건부 금지와 완치 후 가능으로 표시한다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, '감기');
  expect(screen.getByText('조건부 금지')).toBeInTheDocument();
  expect(screen.getByText('완치 후 가능')).toBeInTheDocument();
});

// 제한 기간이 0이면 금지 기간 없음과 즉시 가능으로 표시한다
test('제한 기간이 0이면 금지 기간 없음과 즉시 가능으로 표시한다', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, '코로나19 백신');
  expect(screen.getByText('금지 기간 없음')).toBeInTheDocument();
  expect(screen.getByText('즉시 가능')).toBeInTheDocument();
});

test('데이터 객체는 id 필드를 포함한다', () => {
  const allData = [
    ...require('./data/disease.json'),
    ...require('./data/region.json'),
    ...require('./data/medication.json'),
    ...require('./data/vaccination.json'),
    ...require('./data/etc.json'),
  ];
  expect(allData.every(item => item.id)).toBe(true);
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

test('카테고리 필터 선택 시 해당 항목이 표시된다', async () => {
  render(<App />);
  const select = screen.getByLabelText(/카테고리 필터/i);
  await userEvent.selectOptions(select, '질병');
  expect(screen.getByText('C형 간염')).toBeInTheDocument();
});

test('검색어 입력 시 필터가 숨겨지고 전체 검색이 수행된다', async () => {
  render(<App />);
  const select = screen.getByLabelText(/카테고리 필터/i);
  await userEvent.selectOptions(select, '질병');
  const input = screen.getByPlaceholderText(/검색어를 입력하세요/i);
  await userEvent.type(input, '문신');
  expect(screen.queryByLabelText(/카테고리 필터/i)).toBeNull();
  expect(screen.getByText('문신 시술')).toBeInTheDocument();
});
