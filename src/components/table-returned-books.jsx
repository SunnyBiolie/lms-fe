import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Skeleton, Table } from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { getBooksService } from "@/services/books/get";
import { Table_Book } from "@/configs/db.config";
import { useTransactions } from "@/hooks/use-transactions";

export const TableReturnedBooks = () => {
  const { currentReturned } = useTransactions();

  const mutationGetBooks = useMutation({ mutationFn: getBooksService });

  const [tableData, setTableData] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    if (!currentReturned) return;

    const bookIds = currentReturned.map((tr) => tr.bookId);

    setIsLoading(true);
    mutationGetBooks.mutate(
      {
        bookIds,
      },
      {
        onSuccess: (axiosResponse) => {
          const listBooks = axiosResponse.data.books;

          const tableData = currentReturned.map((t) => {
            const index = listBooks.findIndex((b) => b.id === t.bookId);

            return {
              bookTitle: listBooks[index][Table_Book.title],
              author: listBooks[index][Table_Book.author],
              ...t,
            };
          });

          setTableData(tableData);
        },
        onSettled: () => setIsLoading(false),
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReturned]);

  const colums = [
    {
      title: "Book title",
      dataIndex: "bookTitle",
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
      render: (value) => {
        dayjs.extend(localizedFormat);
        return dayjs(value).format("llll");
      },
    },
    {
      title: "Returned at",
      dataIndex: "returnedAt",
      width: 250,
      render: (value) => {
        dayjs.extend(localizedFormat);
        return dayjs(value).format("llll");
      },
    },
    {
      title: "Renewal",
      dataIndex: "dueDates",
      render: (values) => {
        return values.length - 1;
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
