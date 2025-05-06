// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

const TIMEOUT = 1000;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, TIMEOUT);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, TIMEOUT);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, TIMEOUT);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(TIMEOUT);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const intervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, TIMEOUT);
    expect(intervalSpy).toHaveBeenCalledWith(callback, TIMEOUT);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const INTERVALS_NUM = 3;
    const callback = jest.fn();

    doStuffByInterval(callback, TIMEOUT);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [...Array(INTERVALS_NUM)].forEach((_) => jest.advanceTimersByTime(TIMEOUT));
    expect(callback).toHaveBeenCalledTimes(INTERVALS_NUM);
  });
});

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));
jest.mock('path', () => ({
  join: jest.fn(),
}));
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('readFileAsynchronously', () => {
  const existsSyncMocked = existsSync as jest.Mock;
  const readFileMocked = readFile as jest.Mock;
  const joinMocked = join as jest.Mock;
  const pathToFile = 'some_path';

  beforeEach(() => {
    joinMocked.mockReturnValue(pathToFile);
  });

  test('should call join with pathToFile', async () => {
    existsSyncMocked.mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    existsSyncMocked.mockReturnValue(false);

    expect(await readFileAsynchronously(pathToFile)).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const content = 'Content';

    existsSyncMocked.mockReturnValue(true);
    readFileMocked.mockResolvedValue(Buffer.from(content));

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(content);
  });
});
