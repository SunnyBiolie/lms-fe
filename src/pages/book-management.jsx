import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Space, Typography } from "antd";
import { getAllBooksService } from "@/services/books/get-all";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { TableBooks } from "@/components/reusable/table-books";
import { BtnAddBook } from "@/components/btn-add-book";
import { BtnManageCategory } from "@/components/btn-magane-category";
import { SectionSearchBooks } from "@/components/reusable/section-search-books";
import { SwapOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function BookManagementPage() {
  const [viewMode, setViewMode] = useState("allBooks"); // "allBooks" | "search"

  const changeViewMode = () => {
    setViewMode((prev) => (prev === "allBooks" ? "search" : "allBooks"));
  };

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

  const handleAfterAddSuccess = () => {
    // Vì refetch sẽ được gọi khi setCurrent, tuy nhiên nếu current đang bằng 1 thì setCurrent(1) sẽ không có tác dụng nên mới cần check để fetch dữ liệu mới nhất sau khi thêm sách thành công
    if (current === 1) {
      queryAllBooks.refetch();
    } else {
      setCurrent(1);
    }
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Flex align="center" justify="space-between" className="section">
          <Flex align="center" gap={8}>
            <Text strong underline>
              Change view:
            </Text>
            <Button icon={<SwapOutlined />} onClick={changeViewMode}>
              {viewMode === "allBooks" ? "Search" : "All books"}
            </Button>
          </Flex>
          <Flex gap={8}>
            <BtnManageCategory />
            <BtnAddBook onAfterAddSuccess={handleAfterAddSuccess} />
          </Flex>
        </Flex>
        {viewMode === "allBooks" ? (
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
                    ({queryAllBooks.data && queryAllBooks.data.data.data.total}{" "}
                    books )
                  </Text>
                </Flex>
              )}
            />
          </div>
        ) : (
          <SectionSearchBooks />
        )}
      </Space>
    </>
  );
}
