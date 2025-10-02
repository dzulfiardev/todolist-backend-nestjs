import { TestDatabaseHelper } from './database-helper';

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
  await TestDatabaseHelper.setupTestDatabase();
});

beforeEach(async () => {
  await TestDatabaseHelper.resetDatabase();
});

afterAll(async () => {
  await TestDatabaseHelper.cleanupTestDatabase();
});