import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn() as jest.Mock;

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});