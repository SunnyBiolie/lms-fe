import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Skeleton, Tabs } from "antd";
import { TableBorrowingBooks } from "@/components/table-borrowing-books";
import { TableReturnedBooks } from "@/components/table-returned-books";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useTransactions } from "@/hooks/use-transactions";
import { TableRequestingBook } from "@/components/table-requesting-book";

export default function HistoryPage() {
  const { currentAccount } = useCurrentAccount();
  const {
    currentBorrowing,
    loadListCurrentBorrowing,
    loadListCurrentReturned,
  } = useTransactions();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("tab") === "returned") {
      loadListCurrentReturned();
    } else {
      loadListCurrentBorrowing();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("tab")]);

  if (!currentAccount || !currentBorrowing) return <Skeleton active />;

  const handleTabClick = (key) => {
    setSearchParams({ tab: key }, { replace: true });
  };

  return (
    <div className="section">
      <Tabs
        defaultActiveKey={searchParams.get("tab")}
        items={[
          {
            label: `Borrowing`,
            key: "borrowing",
            children: (
              <TableBorrowingBooks
                currentBorrowing={currentBorrowing}
                loadListBorrowing={loadListCurrentBorrowing}
              />
            ),
          },
          {
            label: "Requesting",
            key: "requesting",
            children: <TableRequestingBook />,
          },
          {
            label: `Returned`,
            key: "returned",
            children: <TableReturnedBooks />,
          },
        ]}
        onTabClick={handleTabClick}
      />
    </div>
  );
}
