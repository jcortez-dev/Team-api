import { jest } from '@jest/globals';
import connect from '../src/configs/mongo';

jest.mock('../src/configs/mongo');

connect.mockImplementation(async () => {
  console.log('Simulating database connection');
});