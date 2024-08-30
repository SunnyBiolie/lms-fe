import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Popconfirm, Skeleton, Space, Table } from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { getBooksService } from "@/services/books/get";
import { returnBookService } from "@/services/transactions/return";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { ModalRenewalBook } from "./modal-renewal-book";
import { rules } from "@/configs/admin.config";
import { useBooks } from "@/hooks/use-books";

export const TableBorrowingBooks = ({ transactions }) => {
  const bookIds = transactions.map((tr) => tr.bookId);

  const mutationGetBooks = useMutation({ mutationFn: getBooksService });

  const [tableData, setTableData] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    setIsLoading(true);
    mutationGetBooks.mutate(
      {
        bookIds,
      },
      {
        onSuccess: (axiosResponse) => {
          const listBooks = axiosResponse.data.books;
          const tableData = transactions.map((t) => {
            const index = listBooks.findIndex((b) => b.id === t.bookId);
            return {
              bookName: listBooks[index].name,
              author: listBooks[index].author,
              ...t,
            };
          });

          setTableData(tableData);
        },
        onSettled: () => setIsLoading(false),
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const colums = [
    {
      title: "Book name",
      dataIndex: "bookName",
      key: 0,
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Borrowed at",
      dataIndex: "borrowedAt",
      width: 250,
      render: (values) => {
        dayjs.extend(localizedFormat);
        return dayjs(values).format("llll");
      },
    },
    {
      title: "Return before",
      dataIndex: "expectedReturnAt",
      width: 250,
      render: (values) => {
        dayjs.extend(localizedFormat);
        return dayjs(values[values.length - 1]).format("llll");
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record, index) => {
        return (
          <Space>
            <RenewalButton transaction={record} />
            <ReturnBookButton
              record={record}
              setTableData={setTableData}
              index={index}
            />
          </Space>
        );
      },
    },
  ];

  if (!tableData) return <Skeleton active />;

  return (
    <Table
      loading={isLoading}
      dataSource={tableData}
      columns={colums}
      rowKey={(recod) => recod.id}
      scroll={{
        x: 1200,
      }}
      pagination={{
        pageSize: 10,
        hideOnSinglePage: true,
      }}
    />
  );
};

const RenewalButton = ({ transaction }) => {
  const { globalMessageApi } = useAntDesign();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    const renewalCount = transaction.expectedReturnAt.length - 1;
    if (renewalCount >= rules.maxTimesOfRenewal) {
      globalMessageApi.error({
        type: "error",
        content: "You reached the maximum number of renewals for this book",
      });
      return;
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Button size="small" onClick={handleOpenModal}>
        Renewal
      </Button>
      <ModalRenewalBook
        isModalOpen={isModalOpen}
        onCloseModal={handleCloseModal}
        transaction={transaction}
      />
    </>
  );
};

const ReturnBookButton = ({ record, setTableData, index }) => {
  const { globalMessageApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const { loadListOfBooks } = useBooks();
  const mutationReturnBook = useMutation({ mutationFn: returnBookService });

  const confirm = async () => {
    await mutationReturnBook.mutateAsync(
      { ...record, userName: currentAccount.userName },
      {
        onSuccess: () => {
          globalMessageApi.success({
            type: "success",
            content: "Return book successfully",
          });
          setTableData((prev) => {
            prev.splice(index, 1);
            return [...prev];
          });
          loadListOfBooks();
        },
      }
    );
  };

  return (
    <Popconfirm
      title="Return book"
      description="Return this book now"
      placement="topRight"
      onConfirm={confirm}
    >
      <Button size="small">Return</Button>
    </Popconfirm>
  );
};
