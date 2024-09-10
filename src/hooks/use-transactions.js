import { TransactionsContext } from "@/providers/transactions-provider";
import { useContext } from "react";

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used with TransactionProvider");
  }
  return context;
};
