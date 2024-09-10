import { Flex, Space } from "antd";
import { useBooks } from "@/hooks/use-books";
import { FormSearchBook } from "@/components/form-search-book";
import { TableBooks } from "@/components/table-books";
import { BtnAddBook } from "@/components/btn-add-book";
import { BtnManageCategory } from "@/components/btn-magane-category";

export default function BookManagementPage() {
  const {
    setSearchValues,
    paginationParams,
    setPaginationParams,
    listOfCategories,
  } = useBooks();

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Flex justify="space-between" className="section">
          <BtnAddBook />
          <BtnManageCategory />
        </Flex>

        <FormSearchBook
          listOfCategories={listOfCategories}
          setSearchValues={setSearchValues}
        />
        <TableBooks
          listOfCategories={listOfCategories}
          paginationParams={paginationParams}
          setPaginationParams={setPaginationParams}
        />
      </Space>
    </>
  );
}
