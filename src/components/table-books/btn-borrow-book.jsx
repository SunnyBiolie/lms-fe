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
import {
  bookNumberPriorForMember,
  bookNumberPriorForVip,
} from "@/configs/membership.config";

export const BtnBorrowBook = ({ book }) => {
  const { currentBorrowing, passRequesting } = useTransactions();
  const { currentAccount } = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState();

  if (!currentAccount || !currentBorrowing || !passRequesting) return;

  const isForVIP =
    (book[Table_Book.isSpecial] || book[Table_Book.price] > bookPriceForVIP) &&
    currentAccount[Table_Account.role] !== "VIP";

  const isPrior = (function calculatePriority() {
    const available =
      book[Table_Book.quantity] - book._count[Table_Book.Transactions];
    let result = true;
    if (available <= bookNumberPriorForVip) {
      switch (currentAccount[Table_Account.role]) {
        case "USER":
          result = false;
          break;
        case "MEMBER":
          result = false;
          break;
      }
    } else if (available <= bookNumberPriorForMember) {
      switch (currentAccount[Table_Account.role]) {
        case "USER":
          result = false;
          break;
      }
    }
    return result;
  })();

  const isBorrowing =
    currentBorrowing.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] !== null
    ) !== -1;

  const isRequesting =
    passRequesting.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] === null
    ) !== -1;

  const tooltip = () => {
    if (!isPrior) return "You do not have priority for borrowing this book";
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

  const disabled = isBorrowing || isForVIP || !isPrior;

  return (
    <>
      <Tooltip destroyTooltipOnHide title={tooltip()} placement="topRight">
        <Button
          disabled={disabled}
          size="small"
          onClick={() => {
            setIsModalOpen(true);
          }}
          danger={isRequesting}
        >
          {title()}
        </Button>
      </Tooltip>
      {!disabled && (
        <ModalBorrowBook
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          book={book}
        />
      )}
    </>
  );
};
