import { Button, Space, Typography } from "antd";
import {
  Table_Account,
  Table_Book,
  Table_Transaction,
} from "@/configs/db.config";
import { bookPriceForVIP } from "@/configs/rules.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import {
  bookNumberPriorForMember,
  bookNumberPriorForVip,
} from "@/configs/membership.config";
import { useTransactions } from "@/hooks/use-transactions";

const { Text } = Typography;

export const BtnBorrowBook = ({ book }) => {
  const { currentBorrowing, passRequesting } = useTransactions();
  const { currentAccount } = useCurrentAccount();

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
    currentBorrowing.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] !== null
    ) !== -1;

  if (isBorrowing)
    return (
      <Text italic underline>
        You are borrowing this book
      </Text>
    );

  const isRequesting =
    passRequesting.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] === null
    ) !== -1;

  if (isRequesting)
    return (
      <Space direction="vertical" align="end">
        <Text italic underline>
          You are requesting this book to be passed on by other users
        </Text>
        <Button danger>Cancel request</Button>
      </Space>
    );

  return <Button>Borrow</Button>;
};
