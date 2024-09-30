import { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { createBooksService } from "@/services/books/create";
import { useAntDesign } from "@/hooks/use-ant-design";
import { numberOfPages, rules } from "@/configs/admin.config";
import { Table_Book } from "@/configs/db.config";
import {
  maxAuthorLength,
  maxBookPrice,
  maxBookTitleLength,
  maxPublicationYear,
  maxPublisherLength,
  minAuthorLength,
  minBookPrice,
  minBookTitleLength,
  minPublisherLength,
  ruleMaxLength,
  ruleMinLength,
  ruleNotBlank,
  ruleRequired,
} from "@/configs/rules.config";

export const ModalAddBook = ({
  isModalOpen,
  listOfCategories,
  onOk,
  onCancel,
}) => {
  const { msgApi } = useAntDesign();

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
        msgApi("success", axiosResponse.data.message);
        form.resetFields();
        onOk();
      },
      onError: (axiosError) => {
        msgApi("error", axiosError.response.data.message);
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
        name="form-add-book"
        form={form}
        onFinish={handleFinish}
        disabled={isLoading}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        size="small"
      >
        <Form.Item
          name={Table_Book.title}
          label="Title"
          rules={[
            ruleRequired(),
            ruleNotBlank(),
            ruleMinLength(minBookTitleLength),
            ruleMaxLength(maxBookTitleLength),
          ]}
        >
          <Input
            minLength={minBookTitleLength}
            maxLength={maxBookTitleLength}
          />
        </Form.Item>
        <Form.Item
          name={Table_Book.author}
          label="Author"
          rules={[
            ruleRequired(),
            ruleNotBlank(),
            ruleMinLength(minAuthorLength),
            ruleMaxLength(maxAuthorLength),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={Table_Book[3]}
          label="Publisher"
          rules={[
            ruleRequired(),
            ruleNotBlank(),
            ruleMinLength(minPublisherLength),
            ruleMaxLength(maxPublisherLength),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={Table_Book.Categories}
          label="Categories"
          rules={[
            {
              required: true,
              message: "Please select at least one category",
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
          name={Table_Book.publicationDate}
          label="Year of publication"
          rules={[ruleRequired()]}
        >
          <DatePicker
            picker="year"
            maxDate={maxPublicationYear}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
          name={Table_Book.quantity}
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
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name={Table_Book.price}
              label="Price"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              initialValue={minBookPrice}
              rules={[
                ruleRequired(),
                {
                  min: minBookPrice,
                  max: maxBookPrice,
                  type: "number",
                },
              ]}
            >
              <InputNumber
                className="w-full"
                min={minBookPrice}
                max={maxBookPrice}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={Table_Book.isSpecial}
              label="Is special"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              initialValue={false}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name={Table_Book[5]}
          label="Number of pages"
          rules={[
            {
              min: numberOfPages.minValue,
              max: numberOfPages.maxValue,
              type: "number",
            },
          ]}
        >
          <InputNumber
            min={numberOfPages.minValue}
            max={numberOfPages.maxValue}
            className="w-full"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
