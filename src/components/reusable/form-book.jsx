import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { Table_Book } from "@/configs/db.config";
import {
  formRule_authorName,
  formRule_bookPages,
  formRule_bookPrice,
  formRule_bookQuantity,
  formRule_bookTitle,
  formRule_categories,
  formRule_publicationYear,
  formRule_publisher,
  formRule_specialBook,
  maxBookPrice,
  maxNumberOfPages,
  maxPublicationYear,
  maxQuantityOfBooks,
  minBookPrice,
  minNumberOfPages,
  minQuantityOfBooks,
} from "@/configs/rules.config";
import { useBooks } from "@/hooks/use-books";

export const FormBook = ({ name, form, onFinish, disabled }) => {
  const { listOfCategories } = useBooks();

  return (
    <Form
      form={form}
      name={name}
      size="small"
      layout="vertical"
      onFinish={onFinish}
      disabled={disabled}
    >
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name={Table_Book.title}
            label="Title"
            rules={formRule_bookTitle}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={Table_Book.author}
            label="Author"
            rules={formRule_authorName}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name={Table_Book.publisher}
            label="Publisher"
            rules={formRule_publisher}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={Table_Book.Categories}
            label="Categories"
            rules={formRule_categories}
          >
            <Select
              mode="multiple"
              options={listOfCategories}
              optionFilterProp="label"
              maxCount={3}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name={Table_Book.publicationDate}
            label="Publication year"
            rules={formRule_publicationYear}
          >
            <DatePicker picker="year" maxDate={maxPublicationYear} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={Table_Book.pages}
            label="Pages"
            rules={formRule_bookPages}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={minNumberOfPages}
              max={maxNumberOfPages}
              formatter={(value) =>
                `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name={Table_Book.price}
            label="Price"
            rules={formRule_bookPrice}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={minBookPrice}
              max={maxBookPrice}
              step={1000}
              formatter={(value) =>
                value && `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} \u20ab`
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={Table_Book.quantity}
            label="Total quantity"
            rules={formRule_bookQuantity}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={minQuantityOfBooks}
              max={maxQuantityOfBooks}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name={Table_Book.isSpecial}
            label="Special book"
            rules={formRule_specialBook}
          >
            <Select
              options={[
                {
                  label: "No",
                  value: 0,
                },
                {
                  label: "Yes",
                  value: 1,
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
