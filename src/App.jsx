import { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Brightness7Rounded,
  Brightness4Rounded,
} from '@mui/icons-material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { ThemeContext } from './contexts/ThemeContext';
import ResultList from './components/ResultList';
import Pagination from './components/Pagination';
import Footer from './components/Footer';

function App() {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [baseDate, setBaseDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const worker = new Worker('/data.worker.js');

    worker.onmessage = (event) => {
      if (event.data.type === 'SUCCESS') {
        setAllData(event.data.payload);
        setIsLoading(false);
      } else {
        console.error('Worker error:', event.data.payload);
        setIsLoading(false);
      }
    };

    worker.onerror = (error) => {
      console.error('Failed to load data worker:', error);
      setIsLoading(false);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, filterType]);

  const formatDate = useCallback((date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}년${mm}월${dd}일`;
  }, []);

  const results = useMemo(() => {
    if (isLoading) return [];
    const lowerQuery = query.toLowerCase();

    if (lowerQuery) {
      return allData.reduce((acc, item) => {
        const lowerName = item.name.toLowerCase();

        if (lowerName.includes(lowerQuery)) {
          acc.push({ ...item, matchedKeyword: item.name });
        } else {
          const matchedKeyword = (item.keywords || []).find((k) =>
            k.toLowerCase().includes(lowerQuery)
          );
          if (matchedKeyword) {
            acc.push({ ...item, matchedKeyword });
          }
        }
        return acc;
      }, []);
    } else {
      return filterType
        ? allData.filter((item) => item.category === filterType)
        : allData;
    }
  }, [query, filterType, allData, isLoading]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
        <header className="grid grid-cols-3 items-center">
          <div></div>
          <h1 className="text-lg sm:text-xl font-bold text-center">
            헌혈 조건 검색
          </h1>
          <div className="flex justify-end">
            <IconButton
              onClick={toggleTheme}
              aria-label="테마 토글"
            >
              {theme === 'light' ? <Brightness4Rounded /> : <Brightness7Rounded />}
            </IconButton>
          </div>
        </header>

        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3 flex-grow">
            <FiSearch />
            <TextField
              variant="outlined"
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
              className="flex-grow"
            />
          </div>
          <TextField
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            size="small"
            inputProps={{ 'aria-label': '기준 날짜' }}
          />
        </div>

        <div className="flex justify-center">
          <FormControl
            size="small"
            aria-label="카테고리 필터"
            className={`flex-wrap ${
              query ? 'invisible' : ''
            } mt-3 sm:mt-0`}
          >
            <InputLabel shrink>카테고리 필터</InputLabel>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={filterType}
              onChange={(e, newType) => {
                if (newType !== null) {
                  setFilterType(newType);
                }
              }}
              className="flex-wrap"
            >
              <ToggleButton value="">전체</ToggleButton>
              <ToggleButton value="질병">질병</ToggleButton>
              <ToggleButton value="지역">지역</ToggleButton>
              <ToggleButton value="약물">약물</ToggleButton>
              <ToggleButton value="백신">백신</ToggleButton>
              <ToggleButton value="시술">시술</ToggleButton>
              <ToggleButton value="기타">기타</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </div>

        <ResultList
          results={paginatedResults}
          query={query}
          baseDate={baseDate}
          formatDate={formatDate}
          totalResultsCount={results.length}
        />

        <div className="mt-8">
          <Pagination
            totalPages={Math.ceil(results.length / ITEMS_PER_PAGE)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <Footer />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
