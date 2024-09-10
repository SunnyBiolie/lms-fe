import { useTransactions } from "@/hooks/use-transactions";
import TransactionsProvider from "@/providers/transactions-provider";

export default function TestPage() {
  console.log("Tets page");

  return (
    <TransactionsProvider>
      <Children />
    </TransactionsProvider>
  );
}

const Children = () => {
  const { currentBorrowing, loadListCurrentBorrowing } = useTransactions();

  console.log(currentBorrowing);

  return <button onClick={loadListCurrentBorrowing}>Load</button>;
};
