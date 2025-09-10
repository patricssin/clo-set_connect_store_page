import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from '@emotion/styled';
import  store from './store';
import { Content } from './pages/Content';

const queryClient = new QueryClient();

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Main = styled.main`
  padding: 2rem 0;
`;

function App() {
  return (
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
  );
}

export default App;