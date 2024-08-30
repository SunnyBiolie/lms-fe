import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { editBookService } from "@/services/books/edit";
import { rules } from "@/configs/admin.config";
import { useBooks } from "@/hooks/use-books";

export const ModalEditBook = ({
  isModalOpen,
  setIsModalOpen,
  listOfCategories,
  data,
}) => {
  const { loadListOfBooks } = useBooks();
  const [form] = Form.useForm();
  const mutationEditBook = useMutation({ mutationFn: editBookService });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.bookData,
        categories: data.bookData.categories.map((item) => {
          const id = listOfCategories.findIndex(
            (cat) => cat.label === item.name
          );
          return listOfCategories[id].value;
        }),
        yearOfPublication: dayjs(data.bookData.yearOfPublication, "YYYY-MM-DD"),
      });
    }
  }, [data]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    setIsLoading(true);
    mutationEditBook.mutate(
      {
        id: data.bookData.id,
        ...values,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          loadListOfBooks();
          handleCancel();
        },
      }
    );
  };

  return (
    <Modal
      // loading={!data}
      title="Edit book"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Edit"
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Form
        disabled={isLoading}
        form={form}
        name="edit-book"
        onFinish={handleFinish}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        {data && (
          <>
            <Form.Item
              name="name"
              label="Name of book"
              rules={[
                {
                  required: true,
                  message: "This field is required",
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
                  message: "This field is required",
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
                  message: "This field is required",
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
                  message: "This field is required",
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
              initialValue={data.bookData.allQuantity}
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
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="yearOfPublication"
              label="Year of publication"
              rules={[
                {
                  required: true,
                  message: "Please select a year of publication",
                },
              ]}
            >
              <DatePicker
                maxDate={dayjs(Date.now())}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};
