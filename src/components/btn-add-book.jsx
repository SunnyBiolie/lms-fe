import { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ModalAddBook } from "./modal-add-book";

export const BtnAddBook = ({ onAfterAddSuccess }) => {
  const [isModalAddBookOpen, setIsModalAddBookOpen] = useState(false);

  const openModalAddBook = () => {
    setIsModalAddBookOpen(true);
  };

  const closeModalAddBook = () => {
    setIsModalAddBookOpen(false);
  };

  const okModalAddBook = () => {
    closeModalAddBook(false);
    onAfterAddSuccess();
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={openModalAddBook}>
        Add book
      </Button>
      <ModalAddBook
        isModalOpen={isModalAddBookOpen}
        onOk={okModalAddBook}
        onCancel={closeModalAddBook}
      />
    </>
  );
};
