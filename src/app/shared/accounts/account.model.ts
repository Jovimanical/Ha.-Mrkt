import { Transaction } from './transaction.model';

export class Account {
  user_id: number;
  accountId: string;
  account_number: string;
  account_blockchain_address: string;
  account_type: string;
  account_status: string;
  account_balance: number;
  account_point: number;
  account_primary: number
  transactions: Array<Transaction>;
}
