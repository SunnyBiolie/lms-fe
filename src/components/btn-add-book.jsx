import { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useBooks } from "@/hooks/use-books";
import { ModalAddBook } from "./modal-add-book";

export const BtnAddBook = () => {
  const { loadListOfBooks, listOfCategories } = useBooks();

  const [isModalAddBookOpen, setIsModalAddBookOpen] = useState(false);

  const openModalAddBook = () => {
    setIsModalAddBookOpen(true);
  };

  const closeModalAddBook = () => {
    setIsModalAddBookOpen(false);
  };

  const okModalAddBook = () => {
    loadListOfBooks("goToFirst");
    closeModalAddBook(false);
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={openModalAddBook}>
        Add book
      </Button>
      <ModalAddBook
        isModalOpen={isModalAddBookOpen}
        listOfCategories={listOfCategories}
        onOk={okModalAddBook}
        onCancel={closeModalAddBook}
      />
    </>
  );
};
