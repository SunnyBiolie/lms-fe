import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Popconfirm, Skeleton, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { deleteBookService } from "@/services/books/delete";
import { useBooks } from "@/hooks/use-books";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { ModalDetailBook } from "./modal-detail-book";
import { ModalEditBook } from "./modal-edit-book";
import { ModalBorrowBook } from "./modal-borrow-book";

export const TableBooks = ({
  listOfCategories,
  paginationParams,
  setPaginationParams,
}) => {
  const { total, current, pageSize } = paginationParams;

  const { currentAccount } = useCurrentAccount();
  const { isLoading, listOfBooks, loadListOfBooks } = useBooks();

  const [modalData, setModalData] = useState();

  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalBorrowOpen, setIsModalBorrowOpen] = useState(false);

  if (!currentAccount || !listOfBooks) return <Skeleton active />;

  const handleTableChange = (pagination) => {
    setPaginationParams(pagination);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      width: 50,
      fixed: "left",
      render: (_, __, index) => {
        return (
          <p style={{ fontWeight: 500, margin: 0 }}>
            {(current - 1) * pageSize + index + 1}
          </p>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 250,
    },
    {
      title: "Author",
      dataIndex: "author",
      width: 220,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      width: 250,
      render: (categories) => {
        const formatedCategories = categories.map((c) => c.name);

        return (
          <>
            {formatedCategories.map((cat, index) => {
              return (
                <Tag
                  key={index}
                  color={"#3b3b3b"}
                  style={{ textTransform: "capitalize" }}
                >
                  {cat}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: currentAccount.role === "ADMIN" ? "Publisher" : "Avaliable",
      dataIndex: "publisher",
      width: 220,
      render: (value, record) => {
        if (currentAccount.role === "ADMIN") return value;
        else return record.allQuantity - record._count.transactions;
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 140,
      render: (_, record) => {
        return (
          <Space>
            <Button
              size="small"
              type="text"
              onClick={() => {
                setIsModalDetailOpen(true);
                setModalData({
                  bookData: record,
                });
              }}
              icon={<InfoCircleOutlined />}
            />
            {currentAccount.role === "ADMIN" ? (
              <>
                <Tooltip
                  title={
                    record._count.transactions !== 0
                      ? "This book is being borrowed"
                      : ""
                  }
                  placement="topLeft"
                >
                  <Button
                    disabled={record._count.transactions !== 0}
                    size="small"
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsModalEditOpen(true);
                      setModalData({
                        bookData: record,
                      });
                    }}
                  />
                </Tooltip>
                <DeleteBookButton
                  disabled={record._count.transactions !== 0}
                  isLast={
                    current === Math.ceil(total / pageSize) &&
                    total % (pageSize * (current - 1)) === 1
                  }
                  bookId={record.id}
                  loadListOfBooks={loadListOfBooks}
                />
              </>
            ) : (
              <>
                <Button
                  disabled={
                    currentAccount.transactions.findIndex(
                      (t) => t.bookId === record.id
                    ) !== -1
                  }
                  size="small"
                  onClick={() => {
                    setIsModalBorrowOpen(true);
                    setModalData({
                      bookData: record,
                    });
                  }}
                >
                  {currentAccount.transactions.findIndex(
                    (t) => t.bookId === record.id
                  ) !== -1
                    ? "Borrowed"
                    : "Borrow"}
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={listOfBooks}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          pageSizeOptions: [5, 10],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          ...paginationParams,
        }}
        scroll={{
          x: 1200,
        }}
        onChange={handleTableChange}
        rowKey={(record) => record.id}
      />
      <ModalDetailBook
        isModalOpen={isModalDetailOpen}
        setIsModalOpen={setIsModalDetailOpen}
        data={modalData}
      />
      {currentAccount.role === "ADMIN" ? (
        <>
          <ModalEditBook
            isModalOpen={isModalEditOpen}
            setIsModalOpen={setIsModalEditOpen}
            listOfCategories={listOfCategories}
            data={modalData}
          />
        </>
      ) : (
        <ModalBorrowBook
          isModalOpen={isModalBorrowOpen}
          setIsModalOpen={setIsModalBorrowOpen}
          data={modalData}
        />
      )}
    </>
  );
};

const DeleteBookButton = ({ disabled, isLast, bookId, loadListOfBooks }) => {
  const mutationDeleteBook = useMutation({ mutationFn: deleteBookService });

  if (disabled)
    return (
      <Tooltip title={"This book is being borrowed"} placement="topLeft">
        <Button
          disabled
          size="small"
          type="default"
          icon={<DeleteOutlined />}
        />
      </Tooltip>
    );

  const handleDeleteBook = async () => {
    await mutationDeleteBook.mutateAsync(
      {
        params: { id: bookId },
      },
      {
        onSuccess: () => {
          if (isLast) loadListOfBooks("deleteLastItem");
          else loadListOfBooks();
        },
      }
    );
  };

  return (
    <>
      <Popconfirm
        title="Delete this book"
        description="Are you sure to delete this book?"
        placement="topRight"
        okType="danger"
        okText="Delete"
        onConfirm={handleDeleteBook}
      >
        <Button size="small" type="default" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </>
  );
};
