import { Space } from "antd";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { FormSearchBook } from "@/components/form-search-book";
import { TableBooks } from "@/components/table-books";

export default function DashboardPage() {
  const { setSearchValues, paginationParams, setPaginationParams } = useBooks();
  const { listOfCategories } = useCategories();

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <FormSearchBook
          setSearchValues={setSearchValues}
          listOfCategories={listOfCategories}
        />
        <TableBooks
          paginationParams={paginationParams}
          setPaginationParams={setPaginationParams}
        />
      </Space>
    </>
  );
}
