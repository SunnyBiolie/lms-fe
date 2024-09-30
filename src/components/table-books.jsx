import { useState } from "react";
import { Button, Flex, Skeleton, Space, Table, Tag, Tooltip } from "antd";
import { EditOutlined, EyeOutlined, StarFilled } from "@ant-design/icons";
import { useBooks } from "@/hooks/use-books";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { ModalDetailBook } from "./table-books/modal-detail-book";
import { ModalEditBook } from "./modal-edit-book";
import { Table_Book } from "@/configs/db.config";
import { BtnDeleteBook } from "./table-books/btn-delete-book";
import { BtnBorrowBook } from "./table-books/btn-borrow-book";

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

  if (!currentAccount || !listOfBooks) return <Skeleton active />;

  const handleTableChange = (pagination) => {
    setPaginationParams(pagination);
  };

  const columns = [
    {
      title: "#",
      dataIndex: Table_Book[0],
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
      title: "Title",
      dataIndex: Table_Book.title,
      width: 250,
    },
    {
      title: "Author",
      dataIndex: Table_Book.author,
      width: 220,
    },
    {
      title: "Categories",
      dataIndex: Table_Book.Categories,
      width: 250,
      render: (categories) => {
        const formatedCategories = categories.map((c) => c.name);

        return (
          <>
            {formatedCategories.map((cat, index) => {
              return (
                <Tag key={index} className="category-tag">
                  {cat}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: (
        <Flex align="center" justify="center">
          Is Special
        </Flex>
      ),
      dataIndex: Table_Book.isSpecial,
      width: 100,
      render: (value) => {
        return (
          value && (
            <Flex align="center" justify="center">
              <StarFilled style={{ color: "#fbdb14", fontSize: "16px" }} />
            </Flex>
          )
        );
      },
    },
    // {
    //   title: "Value",
    //   dataIndex: Table_Book.price,
    //   width: 160,
    //   render: (value) => {
    //     return value.toLocaleString("it-IT", {
    //       style: "currency",
    //       currency: "VND",
    //     });
    //   },
    // },
    {
      title: currentAccount.role === "ADMIN" ? "Publisher" : "Avaliable",
      dataIndex: Table_Book[3],
      width: currentAccount.role === "ADMIN" ? 220 : 100,
      render: (publisher, record) => {
        if (currentAccount.role === "ADMIN") return publisher;
        else
          return record[Table_Book.quantity] - record._count[Table_Book.Transactions];
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
              icon={<EyeOutlined />}
            />
            {currentAccount.role === "ADMIN" ? (
              <>
                <Tooltip
                  title={
                    record._count[Table_Book.Transactions] > 0
                      ? "This book is being borrowed"
                      : ""
                  }
                  placement="topLeft"
                >
                  <Button
                    disabled={record._count[Table_Book.Transactions] > 0}
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
                <BtnDeleteBook
                  disabled={record._count[Table_Book.Transactions] > 0}
                  isLast={
                    current === Math.ceil(total / pageSize) &&
                    total % (pageSize * (current - 1)) === 1
                  }
                  bookId={record[Table_Book[0]]}
                  loadListOfBooks={loadListOfBooks}
                />
              </>
            ) : (
              <BtnBorrowBook book={record} />
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
        <></>
      )}
    </>
  );
};
