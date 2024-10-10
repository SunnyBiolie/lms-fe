import {
  Button,
  Descriptions,
  Divider,
  Flex,
  Row,
  Space,
  Typography,
} from "antd";
import { Table_Account, Table_Book, Table_Category } from "@/configs/db.config";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";
import { ModalEditBook } from "./modal-edit-book";
import { memo, useMemo, useState } from "react";
import { PopConfirmDeleteBook } from "./popconfirm-delete-book";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { BtnBorrowBook } from "./btn-borrow-book";
import { BtnToggleFavoriteBook } from "./btn-toggle-favorite-book";

const { Text } = Typography;

export const DescriptionsBookInfor = ({ book, refetch }) => {
  const borrowingCount = book._count[Table_Book.Transactions];
  const { currentAccount } = useCurrentAccount();
  const isAdmin = currentAccount[Table_Account.role] === "ADMIN";
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const openModalEdit = () => {
    if (borrowingCount === 0 && isAdmin) {
      setIsModalEditOpen(true);
    }
  };
  const closeModalEdit = () => setIsModalEditOpen(false);

  const descriptionsItems = useMemo(
    () => renderBookInforItem(book, borrowingCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book]
  );

  return (
    <>
      <Row className="section">
        <Flex vertical align="end" style={{ flex: 1 }}>
          <Descriptions
            title="Book information"
            extra={
              <ActionWithBook
                isAdmin={isAdmin}
                openModalEdit={openModalEdit}
                borrowingCount={borrowingCount}
                book={book}
                refetch={refetch}
              />
            }
            items={descriptionsItems}
          />
          {!isAdmin && (
            <>
              <Divider />
              <Space>
                <BtnBorrowBook book={book} />
              </Space>
            </>
          )}
        </Flex>
      </Row>
      {borrowingCount === 0 && isAdmin && (
        <ModalEditBook
          book={book}
          open={isModalEditOpen}
          onClose={closeModalEdit}
          refetch={refetch}
        />
      )}
    </>
  );
};

const ActionWithBook = memo(function ActionWithBook({
  isAdmin,
  openModalEdit,
  borrowingCount,
  book,
  refetch,
}) {
  return (
    <Space size="small">
      {isAdmin ? (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={openModalEdit}
            disabled={borrowingCount !== 0}
          >
            Edit
          </Button>
          <PopConfirmDeleteBook
            book={book}
            borrowingCount={borrowingCount}
            refetch={refetch}
          />
        </>
      ) : (
        <>
          <BtnToggleFavoriteBook book={book} />
        </>
      )}
    </Space>
  );
});

const renderBookInforItem = (book, borrowingCount) => {
  return [
    {
      key: Table_Book.title,
      label: "Title",
      children: book[Table_Book.title],
    },
    {
      key: Table_Book.author,
      label: "Author",
      children: book[Table_Book.author],
    },
    {
      key: Table_Book.publisher,
      label: "Publisher",
      children: book[Table_Book.publisher],
    },
    {
      key: Table_Book.Categories,
      label: "Categories",
      children: book[Table_Book.Categories].map((cate, index) => {
        return (
          <Text key={cate[Table_Category.id]} className="capitalize no-wrap">
            {cate[Table_Category.name]}
            {index !== book[Table_Book.Categories].length - 1 && (
              <>&#44;&nbsp;</>
            )}
          </Text>
        );
      }),
    },
    {
      key: Table_Book.publicationDate,
      label: "Publication year",
      children: dayjs(book[Table_Book.publicationDate]).format("YYYY"),
    },
    {
      key: Table_Book.pages,
      label: "Pages",
      children: book[Table_Book.pages],
    },
    {
      key: Table_Book.price,
      label: "Price",
      children: book[Table_Book.price].toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
    },
    {
      key: Table_Book.isSpecial,
      label: "Special book",
      children: book[Table_Book.isSpecial] ? "Yes" : "No",
    },
    {
      key: Table_Book.quantity,
      label: "Total quantity",
      children: book[Table_Book.quantity],
    },
    {
      key: "available",
      label: "Available",
      children: book[Table_Book.quantity] - borrowingCount,
    },
  ];
};
