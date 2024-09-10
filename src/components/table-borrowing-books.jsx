import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Skeleton, Space, Table } from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { getBooksService } from "@/services/books/get";
import {
  Table_Book,
  Table_Renewal,
  Table_Transaction,
} from "@/configs/db.config";
import { BtnRenewal } from "./table-borrowing-books/btn-renewal";
import { BtnReturnBook } from "./table-borrowing-books/btn-return-book";

export const TableBorrowingBooks = ({
  currentBorrowing,
  loadListBorrowing,
}) => {
  const bookIds = currentBorrowing.map((tr) => tr.bookId);

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
          const tableData = currentBorrowing.map((t) => {
            const index = listBooks.findIndex((b) => b.id === t.bookId);
            return {
              title: listBooks[index][Table_Book.title],
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
  }, [currentBorrowing]);

  const colums = [
    {
      title: "Title",
      dataIndex: Table_Book.title,
      key: 0,
    },
    {
      title: "Author",
      dataIndex: Table_Book.author,
    },
    {
      title: "Borrowed at",
      dataIndex: Table_Transaction.borrowedAt,
      width: 250,
      render: (value) => {
        dayjs.extend(localizedFormat);
        return dayjs(value).format("llll");
      },
    },
    {
      title: "Return before",
      dataIndex: Table_Transaction.dueDate,
      width: 250,
      render: (value, record) => {
        dayjs.extend(localizedFormat);
        const r =
          record[Table_Transaction.Renewals].length > 0
            ? record[Table_Transaction.Renewals][0][Table_Renewal.dueDate]
            : value;
        return dayjs(r).format("llll");
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record) => {
        return (
          <Space>
            <BtnRenewal
              borrowingRecord={record}
              loadListBorrowing={loadListBorrowing}
            />
            <BtnReturnBook
              borrowingRecord={record}
              loadListBorrowing={loadListBorrowing}
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
