import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (total, transaction) => {
        if (transaction.type === 'income') {
          total.income += transaction.value;
        } else if (transaction.type === 'outcome') {
          total.outcome += transaction.value;
        }
        return total;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: Request): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);
    const balance = this.getBalance();

    if (balance.total < 0) {
      throw Error('No money left!');
    }

    return transaction;
  }
}

export default TransactionsRepository;
