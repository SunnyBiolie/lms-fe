import { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { createBooksService } from "@/services/books/create";
import { useAntDesign } from "@/hooks/use-ant-design";
import { rules } from "@/configs/admin.config";

export const ModalAddBook = ({
  isModalOpen,
  listOfCategories,
  onOk,
  onCancel,
}) => {
  const { globalMessageApi } = useAntDesign();

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const mutationCreateBook = useMutation({ mutationFn: createBooksService });

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleFinish = (values) => {
    setIsLoading(true);
    mutationCreateBook.mutate(values, {
      onSuccess: (axiosResponse) => {
        globalMessageApi.success({
          type: "success",
          content: axiosResponse.data.message,
        });
        form.resetFields();
        onOk();
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
    });
  };

  return (
    <Modal
      destroyOnClose
      open={isModalOpen}
      title="Add new book"
      onOk={handleOk}
      onCancel={handleCancel}
      // eslint-disable-next-line no-unused-vars
      footer={(_, { __, CancelBtn }) => (
        <>
          <CancelBtn />
          <Button type="primary" onClick={handleOk} loading={isLoading}>
            Create
          </Button>
        </>
      )}
    >
      <Form
        name="add-book"
        form={form}
        onFinish={handleFinish}
        disabled={isLoading}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="name"
          label="Name of book"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="author"
          label="Author"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="publisher"
          label="Publisher"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categories"
          label="Categories"
          rules={[
            {
              required: true,
              message: "Please select",
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            optionFilterProp="label"
            options={listOfCategories}
          />
        </Form.Item>
        <Form.Item
          name="allQuantity"
          label="Number of books"
          initialValue={rules.initQuantityOfBooks}
          rules={[
            {
              min: rules.minQuantityOfBooks,
              max: rules.maxQuantityOfBooks,
              type: "number",
            },
          ]}
        >
          <InputNumber
            min={rules.minQuantityOfBooks}
            max={rules.maxQuantityOfBooks}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
          name="yearOfPublication"
          label="Year of publication"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker
            maxDate={dayjs(Date.now())}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
