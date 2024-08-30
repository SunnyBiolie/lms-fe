import { useState } from "react";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { ModalAddBook } from "@/components/modal-add-book";
import { FormSearchBook } from "@/components/form-search-book";
import { TableBooks } from "@/components/table-books";

export default function BookManagementPage() {
  const [isModalAddBookOpen, setIsModalAddBookOpen] = useState(false);

  const openModalAddBook = () => {
    setIsModalAddBookOpen(true);
  };

  const closeModalAddBook = () => {
    setIsModalAddBookOpen(false);
  };

  const { listOfCategories } = useCategories();

  const {
    loadListOfBooks,
    setSearchValues,
    paginationParams,
    setPaginationParams,
  } = useBooks();

  const okModalAddBook = () => {
    loadListOfBooks("goToFirst");
    closeModalAddBook(false);
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={openModalAddBook}
        >
          Add new book
        </Button>
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
      <ModalAddBook
        isModalOpen={isModalAddBookOpen}
        listOfCategories={listOfCategories}
        onOk={okModalAddBook}
        onCancel={closeModalAddBook}
      />
    </>
  );
}
