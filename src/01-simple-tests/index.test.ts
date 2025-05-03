// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 2, action: Action.Add })).toBe(3);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 2, action: Action.Subtract })).toBe(8);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 5, b: 2, action: Action.Multiply })).toBe(10);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 5, action: Action.Divide })).toBe(2);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 3, b: 3, action: Action.Exponentiate })).toBe(
      27,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 1, b: 2, action: 'Invalid' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    Object.values(Action).forEach((action) =>
      expect(simpleCalculator({ a: '1', b: '2', action: action })).toBeNull(),
    );
    Object.values(Action).forEach((action) =>
      expect(simpleCalculator({ a: '5', b: 2, action: action })).toBeNull(),
    );
  });
});
