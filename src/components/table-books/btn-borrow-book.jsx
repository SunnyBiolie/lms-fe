import { useState } from "react";
import { Button, Tooltip } from "antd";
import { useTransactions } from "@/hooks/use-transactions";
import { ModalBorrowBook } from "./modal-borrow-book";

export const BtnBorrowBook = ({ book }) => {
  const { currentBorrowing } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState();

  if (!currentBorrowing) return;

  const isBorrowing =
    currentBorrowing.findIndex((t) => t.bookId === book.id) !== -1;

  return (
    <>
      <Tooltip
        destroyTooltipOnHide
        title={isBorrowing ? "You are borrowing this book" : ""}
        placement="topRight"
      >
        <Button
          disabled={isBorrowing}
          size="small"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {isBorrowing ? "Borrowed" : "Borrow"}
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
