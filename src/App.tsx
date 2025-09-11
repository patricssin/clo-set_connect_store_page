import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from '@emotion/styled';
import  store from './store';
import { Content } from './pages/Content';
import { Theme, ThemeProvider } from '@emotion/react';
export const theme: Theme = {
  dark: {
    appBgColor: '#313335',
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow: '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#c2bebe',
    hoverBgColor: '#646567',
  },
};

const queryClient = new QueryClient();

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({theme}) => theme.dark.appBgColor};
`;

const Main = styled.main`
  padding: 2rem 0;
`;


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppContainer>
              <Main>
                <Routes>
                  <Route path="/" element={<Content />} />
                </Routes>
              </Main>
            </AppContainer>
          </Router>
        </QueryClientProvider>
      </Provider> 
    </ThemeProvider>
  );
}

export default App;