import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Flex, Table, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { createStyles } from "antd-style";
import { capitalize } from "@/lib/capitalize";
import {
  Field_Account_Role,
  Table_Account,
  Table_Book,
} from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
// import { noImage } from "@/assets/no-imge";
import { ListCategories } from "./list-categories";
import { ModalEditBook } from "../page-book/modal-edit-book";

const { Text } = Typography;

const useStyles = createStyles(({ token, css }) => ({
  coverImage: css`
    height: 64px;
    aspect-ratio: 3/4;
    border-radius: 4px;
    border: 1px solid #ccc;
  `,
  iconIsSpecialYes: css`
    color: ${token.colorSecondary};
    font-size: 20px;
  `,
  iconIsSpecialNo: css`
    color: #ccc;
    font-size: 20px;
  `,
}));

// # NOTE:
// isLoading: boolean
// data: { listBooks, total, pagination: { current: number, pageSize: number } }
// refetch(type: "paginate" | "afterEdit", data: { page: number, pageSize: number })
// title: () => ReactNode
export const TableBooks = ({ isLoading, data, refetch, title }) => {
  const { styles } = useStyles();
  const { currentAccount } = useCurrentAccount();
  const isAdmin =
    currentAccount[Table_Account.role] === Field_Account_Role.admin;

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
    {
      title: "Is special",
      dataIndex: Table_Book.isSpecial,
      render: (value) => {
        return value ? (
          <CheckCircleOutlined className={styles.iconIsSpecialYes} />
        ) : (
          <CloseCircleOutlined className={styles.iconIsSpecialNo} />
        );
      },
      width: 120,
      align: "center",
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
                <Button icon={<DeleteOutlined />} size="small" danger />
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
