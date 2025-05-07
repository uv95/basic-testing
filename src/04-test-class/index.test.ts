// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount instanceof BankAccount).toBeTruthy();
    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.withdraw(150)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const firstBankAccount = getBankAccount(100);
    const secondBankAccount = getBankAccount(0);

    expect(() => firstBankAccount.transfer(150, secondBankAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.transfer(50, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const deposit = 50;

    const bankAccount = getBankAccount(initialBalance);
    bankAccount.deposit(deposit);
    expect(bankAccount.getBalance()).toBe(initialBalance + deposit);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const withdrawal = 50;

    const bankAccount = getBankAccount(initialBalance);
    bankAccount.withdraw(withdrawal);
    expect(bankAccount.getBalance()).toBe(initialBalance - withdrawal);
  });

  test('should transfer money', () => {
    const firstAccountBalance = 100;
    const secondAccountBalance = 50;
    const transferAmount = 50;
    const firstBankAccount = getBankAccount(firstAccountBalance);
    const secondBankAccount = getBankAccount(secondAccountBalance);

    firstBankAccount.transfer(transferAmount, secondBankAccount);

    expect(firstBankAccount.getBalance()).toBe(
      firstAccountBalance - transferAmount,
    );
    expect(secondBankAccount.getBalance()).toBe(
      secondAccountBalance + transferAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchedBalance = 0.5;
    const bankAccount = getBankAccount(100);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(fetchedBalance);
    const result = await bankAccount.fetchBalance();

    expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 200;
    const fetchedBalance = 0.5;
    const bankAccount = getBankAccount(initialBalance);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(fetchedBalance);

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(100);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
