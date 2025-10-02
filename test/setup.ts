import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

// Load test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://root:root@localhost:3309/todo_list_app_test';

beforeAll(async () => {
  console.log('Setting up test database...');
  
  try {
    // Create test database if it doesn't exist
    await execAsync(`mysql -u root -proot -h localhost -P 3309 -e "CREATE DATABASE IF NOT EXISTS todo_list_app_test;"`);
    
    // Run Prisma migrations on test database
    await execAsync('npx prisma db push', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });
    
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});

afterAll(async () => {
  console.log('Cleaning up test database...');
  
  try {
    // Clean up test database
    await execAsync(`mysql -u root -proot -h localhost -P 3309 -e "DROP DATABASE IF EXISTS todo_list_app_test;"`);
    console.log('Test database cleanup complete');
  } catch (error) {
    console.error('Failed to cleanup test database:', error);
  }
});