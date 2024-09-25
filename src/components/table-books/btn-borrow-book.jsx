import { useState } from "react";
import { Button, Tooltip } from "antd";
import { useTransactions } from "@/hooks/use-transactions";
import { ModalBorrowBook } from "./modal-borrow-book";
import {
  Table_Account,
  Table_Book,
  Table_Transaction,
} from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { bookPriceForVIP } from "@/configs/rules.config";

export const BtnBorrowBook = ({ book }) => {
  const { currentBorrowing, passRequesting } = useTransactions();
  const { currentAccount } = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState();

  if (!currentAccount || !currentBorrowing || !passRequesting) return;

  const isForVIP =
    (book[Table_Book.isSpecial] || book[Table_Book.price] > bookPriceForVIP) &&
    currentAccount[Table_Account.role] !== "VIP";

  const isBorrowing =
    currentBorrowing.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] !== null
    ) !== -1;

  const isRequesting =
    passRequesting.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] === null
    ) !== -1;

  const tooltip = () => {
    if (isBorrowing) return "You are borrowing this book";
    if (isRequesting)
      return "You are requesting the book to be passed by other users";
    return "";
  };

  const title = () => {
    if (isBorrowing) return "Borrowed";
    if (isRequesting) return "Cancel";
    if (isForVIP) return "VIP only";
    return "Borrow";
  };

  return (
    <>
      <Tooltip destroyTooltipOnHide title={tooltip()} placement="topRight">
        <Button
          disabled={isBorrowing || isForVIP}
          size="small"
          onClick={() => {
            setIsModalOpen(true);
          }}
          danger={isRequesting}
        >
          {title()}
        </Button>
      </Tooltip>
      {(!isBorrowing || !isForVIP) && (
        <ModalBorrowBook
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          book={book}
        />
      )}
    </>
  );
};
