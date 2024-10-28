import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Flex, Table, Tag, Tooltip, Typography } from "antd";
import {
  // CheckCircleOutlined,
  // CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
// import { createStyles } from "antd-style";
import { capitalize } from "@/lib/capitalize";
import { Table_Account, Table_Book } from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
// import { noImage } from "@/assets/no-imge";
import { ListCategories } from "./list-categories";
import { ModalEditBook } from "../page-book/modal-edit-book";
import { useTransactions } from "@/hooks/use-transactions";
import { bookPriceForVIP } from "@/configs/rules.config";
import {
  bookNumberPriorForMember,
  bookNumberPriorForVip,
} from "@/configs/membership.config";
import { BtnDeleteBook } from "../table-books/btn-delete-book";

const { Text } = Typography;

// const useStyles = createStyles(({ token, css }) => ({
//   coverImage: css`
//     height: 64px;
//     aspect-ratio: 3/4;
//     border-radius: 4px;
//     border: 1px solid #ccc;
//   `,
//   iconIsSpecialYes: css`
//     color: ${token.colorSecondary};
//     font-size: 20px;
//   `,
//   iconIsSpecialNo: css`
//     color: #ccc;
//     font-size: 20px;
//   `,
// }));

// # NOTE:
// isLoading: boolean
// data: { listBooks, total, pagination: { current: number, pageSize: number } }
// refetch(type: "paginate" | "afterEdit", data: { page: number, pageSize: number })
// title: () => ReactNode
export const TableBooks = ({ isLoading, data, refetch, title }) => {
  // const { styles } = useStyles();
  const { isAdmin } = useCurrentAccount();

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState();

  const { listBooks, total, pagination } = data || {
    listBooks: [],
    total: 0,
    pagination: {},
  };

  const { current, pageSize } = pagination;

  const columns = [
    {
      title: "#",
      dataIndex: Table_Book.id,
      render: (_, __, index) => {
        return <Text strong>{(current - 1) * pageSize + (index + 1)}</Text>;
      },
      width: 60,
      align: "center",
      fixed: "left",
    },
    // {
    //   title: "Cover",
    //   dataIndex: Table_Book.imageLink,
    //   render: (value) => {
    //     return (
    //       <img
    //         src={value ? `${value}?tr=ar-3-4,h-60` : noImage}
    //         className={styles.coverImage}
    //       ></img>
    //     );
    //   },
    //   width: 100,
    //   align: "center",
    // },
    {
      title: capitalize(Table_Book.title),
      dataIndex: Table_Book.title,
    },
    {
      title: capitalize(Table_Book.author),
      dataIndex: Table_Book.author,
    },
    {
      title: capitalize(Table_Book.Categories),
      dataIndex: Table_Book.Categories,
      render: (value) => {
        return <ListCategories categories={value} isLink={!isAdmin} />;
      },
    },
    {
      title: capitalize(Table_Book.publisher),
      dataIndex: Table_Book.publisher,
    },
    // {
    //   title: "Is special",
    //   dataIndex: Table_Book.isSpecial,
    //   render: (value) => {
    //     return value ? (
    //       <CheckCircleOutlined className={styles.iconIsSpecialYes} />
    //     ) : (
    //       <CloseCircleOutlined className={styles.iconIsSpecialNo} />
    //     );
    //   },
    //   width: 120,
    //   align: "center",
    // },
    {
      title: "Status",
      render: (_, record) => {
        return <BookStatus book={record} />;
      },
      width: 140,
    },
    {
      title: "Action",
      dataIndex: Table_Book.id,
      render: (value, record) => {
        return (
          <Flex align="center" justify="center" gap={6}>
            <Link to={`/book/${value}`}>
              <Button icon={<LinkOutlined />} size="small" />
            </Link>
            {isAdmin && (
              <>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => handleEditBook(record)}
                />
                {/* <Button icon={<DeleteOutlined />} size="small" danger /> */}
                {/* <BtnDeleteBook /> */}
              </>
            )}
          </Flex>
        );
      },
      width: 120,
      align: "center",
      fixed: "right",
    },
  ];

  const handleEditBook = (book) => {
    setCurrentBook(book);
    setIsModalEditOpen(true);
  };

  const cancelEditBook = () => {
    setCurrentBook(undefined);
    setIsModalEditOpen(false);
  };

  const handleChangePagination = (page, pageSize) => {
    refetch("paginate", { page, pageSize });
  };

  return (
    <>
      <Table
        dataSource={listBooks}
        columns={columns}
        title={title}
        size="large"
        rowKey={(item) => item[Table_Book.id]}
        pagination={{
          position: ["bottomCenter"],
          current,
          pageSize,
          total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: [5, 10],
          showSizeChanger: true,
          onChange: handleChangePagination,
        }}
        scroll={{
          x: 1200,
        }}
        loading={isLoading}
      />
      {isAdmin && (
        <ModalEditBook
          open={isModalEditOpen}
          book={currentBook}
          onClose={cancelEditBook}
          refetch={() => refetch("afterEdit")}
        />
      )}
    </>
  );
};

export const BookStatus = ({ book }) => {
  const { currentBorrowing, passRequesting } = useTransactions();
  const { currentAccount, isAdmin } = useCurrentAccount();

  if (!currentAccount) return;
  if (isAdmin) {
    const statusAdmin =
      book._count[Table_Book.Transactions] === 0 ? (
        <Tooltip title="">
          <Tag color="green">Editable</Tag>
        </Tooltip>
      ) : (
        <Tooltip title="This book has been borrowed by several accounts">
          <Tag color="red">Borrowing</Tag>
        </Tooltip>
      );
    return statusAdmin;
  } else {
    if (!currentBorrowing || !passRequesting) return;
    const statusReader = checkDisplayBorrowBtn(
      book,
      currentAccount,
      currentBorrowing,
      passRequesting
    );
    return statusReader;
  }
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
      <Tooltip title="This book is for VIP only">
        <Tag color="red">VIP only</Tag>
      </Tooltip>
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
      <Tooltip title="You do not have priority for borrowing this book">
        <Tag color="red">Priority</Tag>
      </Tooltip>
    );

  const isBorrowing =
    currentBorrowing.findIndex((t) => t.bookId === book.id) !== -1;

  if (isBorrowing)
    return (
      <Tooltip title="You are borrowing this book">
        <Tag color="blue">Borrowing</Tag>
      </Tooltip>
    );

  const reqIndex = passRequesting.findIndex((t) => t.bookId === book.id);

  if (reqIndex !== -1)
    return (
      <Tooltip title="You are requesting this book">
        <Tag color="blue">Requesting</Tag>
      </Tooltip>
    );

  return (
    <Tooltip title="">
      <Tag color="green">Available</Tag>
    </Tooltip>
  );
};
