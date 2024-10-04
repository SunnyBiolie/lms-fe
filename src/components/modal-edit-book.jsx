import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { editBookService } from "@/services/books/edit";
import { rules } from "@/configs/admin.config";
import { useBooks } from "@/hooks/use-books";
import { useAntDesign } from "@/hooks/use-ant-design";
import { Table_Book } from "@/configs/db.config";

export const ModalEditBook = ({
  isModalOpen,
  setIsModalOpen,
  listOfCategories,
  data,
}) => {
  const { msgApi } = useAntDesign();
  const { loadListOfBooks } = useBooks();
  const [form] = Form.useForm();
  const mutationEditBook = useMutation({ mutationFn: editBookService });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data && isModalOpen) {
      form.setFieldsValue({
        ...data.bookData,
        Categories: data.bookData[Table_Book.Categories].map((item) => {
          const id = listOfCategories.findIndex(
            (cat) => cat.label.toLowerCase() === item.name.toLowerCase()
          );
          return listOfCategories[id].value;
        }),
        [Table_Book.publicationDate]: dayjs(data.bookData[Table_Book.publicationDate], "YYYY-MM-DD"),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        id: data.bookData[Table_Book.id],
        ...values,
      },
      {
        onSuccess: (axiosResponse) => {
          loadListOfBooks();
          handleCancel();
          msgApi("success", axiosResponse.data.message);
        },
        onError: (axiosError) =>
          msgApi("error", axiosError.response.data.message),
        onSettled: () => setIsLoading(false),
      }
    );
  };

  return (
    <Modal
      destroyOnClose
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
        name="form-edit-book"
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
              name={[Table_Book.title]}
              label="Title of book"
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
              name={[Table_Book.author]}
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
              name={[Table_Book.publisher]}
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
              name={[Table_Book.Categories]}
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
              name={[Table_Book.publicationDate]}
              label="Year of publication"
              rules={[
                {
                  required: true,
                  message: "Please select a year of publication",
                },
              ]}
            >
              <DatePicker
                picker="year"
                maxDate={dayjs(Date.now())}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name={[Table_Book.quantity]}
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
                className="w-full"
              />
            </Form.Item>
            <Form.Item name={[Table_Book.pages]} label="Pages">
              <InputNumber className="w-full" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};
