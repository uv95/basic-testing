// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: (relativePath: string) => Promise<unknown>) => fn,
}));
const relativePath = '/path';

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    (axios.create as jest.Mock).mockReturnValue(axios);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: {} });
    await throttledGetDataFromApi(relativePath);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: {} });
    await throttledGetDataFromApi(relativePath);

    expect(axios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const mockData = 'some data';
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    expect(await throttledGetDataFromApi(relativePath)).toEqual(mockData);
  });
});
