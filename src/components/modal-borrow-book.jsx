import dayjs from "dayjs";
import { DatePicker, Form, Modal, Typography } from "antd";
import { rules } from "@/configs/admin.config";
import { useMutation } from "@tanstack/react-query";
import { createTransactionService } from "@/services/transactions/create";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useState } from "react";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useBooks } from "@/hooks/use-books";

export const ModalBorrowBook = ({ isModalOpen, setIsModalOpen, data }) => {
  const { currentAccount } = useCurrentAccount();
  const { loadListOfBooks } = useBooks();
  const { globalMessageApi } = useAntDesign();
  const [form] = Form.useForm();
  const mutationCreateTransaction = useMutation({
    mutationFn: createTransactionService,
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
    mutationCreateTransaction.mutate(
      {
        ...formValues,
        bookId: data.bookData.id,
        accountId: currentAccount.id,
      },
      {
        onSuccess: (axiosResponse) => {
          globalMessageApi.success({
            type: "success",
            content: axiosResponse.data.message,
          });
          loadListOfBooks();
          handleCancel();
        },
        onError: (axiosError) => {
          globalMessageApi.error({
            type: "error",
            content: axiosError.response.data.message,
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Modal
      open={isModalOpen}
      title={
        <Typography.Title level={5} style={{ margin: 0 }}>
          Borrow &quot;{data?.bookData.name}&quot;
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
        <Typography.Text strong>{data?.bookData.author}</Typography.Text>
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
          name="expectedReturnAt"
          label="Book return date"
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
