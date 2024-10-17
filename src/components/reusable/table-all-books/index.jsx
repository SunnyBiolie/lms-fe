import { checkToLogOut } from "@/lib/check-to-log-out";
import { getAllBooksService } from "@/services/books/get-all";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TableBooks } from "../table-books";
import { Flex, Typography } from "antd";

const { Text } = Typography;

export const TableAllBooks = () => {
  // current và pageSize cho bảng toàn bộ sách
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const queryAllBooks = useQuery({
    queryKey: ["all-books"],
    queryFn: () =>
      getAllBooksService({
        params: {
          current,
          pageSize,
        },
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    queryAllBooks.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize]);

  if (queryAllBooks.error) checkToLogOut(queryAllBooks.error);

  const refetchAllBooks = (type, data) => {
    switch (type) {
      case "paginate":
        setCurrent(data.page);
        setPageSize(data.pageSize);
        break;
      case "afterEdit":
        queryAllBooks.refetch();
        break;
    }
  };

  return (
    <div className="section">
      <TableBooks
        data={queryAllBooks.data && queryAllBooks.data.data.data}
        isLoading={queryAllBooks.isFetching}
        refetch={refetchAllBooks}
        title={() => (
          <Flex align="center" gap={8}>
            <Text strong style={{ fontSize: "16px" }}>
              List of all books
            </Text>
            <Text italic>
              ({queryAllBooks.data && queryAllBooks.data.data.data.total} books)
            </Text>
          </Flex>
        )}
      />
    </div>
  );
};
