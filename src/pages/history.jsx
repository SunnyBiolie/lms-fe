import { TableBorrowingBooks } from "@/components/table-borrowing-books";
import { TableReturnedBooks } from "@/components/table-returned-books";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { getLogsService } from "@/services/logs/get";
import { getTransactionsService } from "@/services/transactions/get";
import { useMutation } from "@tanstack/react-query";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function HistoryPage() {
  const { currentAccount } = useCurrentAccount();
  const mutationGetTransactions = useMutation({
    mutationFn: getTransactionsService,
  });
  const mutationGetLogs = useMutation({
    mutationFn: getLogsService,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const [transactions, setTransactions] = useState();
  const [listReturned, setListReturned] = useState([]);

  useEffect(() => {
    if (searchParams.get("tab") === "returned") {
      mutationGetLogs.mutate(
        {
          params: {
            accountId: currentAccount.id,
          },
        },
        {
          onSuccess: (axiosResponse) => {
            setListReturned(axiosResponse.data.logs);
          },
        }
      );
    } else {
      mutationGetTransactions.mutate(
        {
          params: {
            accountId: currentAccount.id,
          },
        },
        {
          onSuccess: (axiosResponse) => {
            setTransactions(axiosResponse.data.listTransactions);
          },
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("tab")]);

  if (!currentAccount || !transactions || !listReturned) return;

  const handleTabClick = (key) => {
    setSearchParams({ tab: key }, { replace: true });
  };

  return (
    <>
      <Tabs
        defaultActiveKey={searchParams.get("tab")}
        type="card"
        items={[
          {
            label: `Borrowing`,
            key: "borrowing",
            children: <TableBorrowingBooks transactions={transactions} />,
          },
          {
            label: `Returned`,
            key: "returned",
            children: <TableReturnedBooks listReturned={listReturned} />,
          },
        ]}
        onTabClick={handleTabClick}
      />
    </>
  );
}
