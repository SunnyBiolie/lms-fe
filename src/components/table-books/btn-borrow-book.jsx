import { useState } from "react";
import { Button, Tooltip } from "antd";
import { useTransactions } from "@/hooks/use-transactions";
import { ModalBorrowBook } from "./modal-borrow-book";
import { Table_Transaction } from "@/configs/db.config";

export const BtnBorrowBook = ({ book }) => {
  const { currentBorrowing, passRequesting } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState();

  if (!currentBorrowing || !passRequesting) return;

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
    return "Borrow";
  };

  return (
    <>
      <Tooltip destroyTooltipOnHide title={tooltip()} placement="topRight">
        <Button
          disabled={isBorrowing}
          size="small"
          onClick={() => {
            setIsModalOpen(true);
          }}
          danger={isRequesting}
        >
          {title()}
        </Button>
      </Tooltip>
      <ModalBorrowBook
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        book={book}
      />
    </>
  );
};
