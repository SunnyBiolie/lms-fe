import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Skeleton, Table } from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { getBooksService } from "@/services/books/get";

export const TableReturnedBooks = ({ listReturned }) => {
  const bookIds = listReturned.map((tr) => tr.bookId);

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

          const tableData = listReturned.map((t) => {
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
  }, [listReturned]);

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
      title: "Borrow at",
      dataIndex: "borrowedAt",
      width: 250,
      render: (values) => {
        dayjs.extend(localizedFormat);
        return dayjs(values).format("llll");
      },
    },
    {
      title: "Return at",
      dataIndex: "actualReturnedAt",
      width: 250,
      render: (values) => {
        dayjs.extend(localizedFormat);
        return dayjs(values).format("llll");
      },
    },
    {
      title: "Renewal",
      dataIndex: "expectedReturnAt",
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
