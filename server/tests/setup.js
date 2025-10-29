import mongoose from 'mongoose';

// Global test setup
beforeAll(async () => {
  // Additional global setup if needed
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Global test teardown
afterEach(async () => {
  // Clean up after each test
});