export interface Transaction {
  id: string;
  type: "Received" | "Sent";
  amount: number;
  from: string;
  to: string;
  date: string;
}

export interface WalletData {
  balance: number;
  transactions: Transaction[];
}
