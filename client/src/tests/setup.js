import '@testing-library/jest-dom';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Uncomment to debug tests
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};