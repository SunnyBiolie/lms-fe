import { useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Modal, Typography } from "antd";
import { rules } from "@/configs/admin.config";
import { Table_Book, Table_Transaction } from "@/configs/db.config";
import { createBorrowingService } from "@/services/transaction/create";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useBooks } from "@/hooks/use-books";
import { useTransactions } from "@/hooks/use-transactions";

export const ModalBorrowBook = ({ isModalOpen, setIsModalOpen, book }) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const { loadListOfBooks } = useBooks();
  const { loadListCurrentBorrowing } = useTransactions();
  const [form] = Form.useForm();
  const mutationCreateBorrowing = useMutation({
    mutationFn: createBorrowingService,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleSubmit = (formValues) => {
    setIsLoading(true);
    mutationCreateBorrowing.mutate(
      {
        ...formValues,
        bookId: book.id,
        accountId: currentAccount.id,
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          loadListOfBooks();
          loadListCurrentBorrowing();
          handleCancel();
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Modal
      destroyOnClose
      open={isModalOpen}
      title={
        <Typography.Title level={5} style={{ margin: 0 }}>
          Borrow &quot;{book[Table_Book.title]}&quot;
        </Typography.Title>
      }
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Borrow"
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Typography.Paragraph style={{ textAlign: "center" }}>
        written by{" "}
        <Typography.Text strong>{book[Table_Book.author]}</Typography.Text>
      </Typography.Paragraph>
      <Form
        clearOnDestroy
        form={form}
        name="borrow-book"
        disabled={isLoading}
        layout="vertical"
        style={{ padding: "12px 0" }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name={Table_Transaction.dueDate}
          label="Return date"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={dayjs(Date.now() + 86400000 * rules.maxDateOfBorrow)}
        >
          <DatePicker
            minDate={dayjs(Date.now())}
            maxDate={dayjs(Date.now() + 86400000 * rules.maxDateOfBorrow)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
