import { useState } from "react";
import { Button, Typography } from "antd";
import { Table_Account, Table_Book } from "@/configs/db.config";
import { bookPriceForVIP } from "@/configs/rules.config";
import {
  bookNumberPriorForMember,
  bookNumberPriorForVip,
} from "@/configs/membership.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useTransactions } from "@/hooks/use-transactions";
import { ModalBorrowBook } from "../table-books/modal-borrow-book";
import { BtnCancelReq } from "./btn-cancel-req";

const { Text } = Typography;

export const BtnBorrowBook = ({ book }) => {
  const { currentBorrowing, passRequesting } = useTransactions();
  const { currentAccount } = useCurrentAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentAccount || !currentBorrowing || !passRequesting) return;

  const renderFailedCheck = checkDisplayBorrowBtn(
    book,
    currentAccount,
    currentBorrowing,
    passRequesting
  );

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!renderFailedCheck) return renderFailedCheck;

  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <Button type="primary" onClick={openModal}>
        Borrow
      </Button>
      <ModalBorrowBook
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        book={book}
      />
    </>
  );
};

const checkDisplayBorrowBtn = (
  book,
  currentAccount,
  currentBorrowing,
  passRequesting
) => {
  const VipOnly =
    (book[Table_Book.isSpecial] || book[Table_Book.price] > bookPriceForVIP) &&
    currentAccount[Table_Account.role] !== "VIP";

  if (VipOnly)
    return (
      <Text italic underline>
        This book is for VIP only
      </Text>
    );

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

  if (!isPrior)
    return (
      <Text italic underline>
        You do not have priority for borrowing this book
      </Text>
    );

  const isBorrowing =
    currentBorrowing.findIndex((t) => t.bookId === book.id) !== -1;

  if (isBorrowing)
    return (
      <Text italic underline>
        You are borrowing this book
      </Text>
    );

  const reqIndex = passRequesting.findIndex((t) => t.bookId === book.id);

  if (reqIndex !== -1)
    return <BtnCancelReq request={passRequesting[reqIndex]} />;
};
