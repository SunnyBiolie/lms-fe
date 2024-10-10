import { Button, Col, DatePicker, Flex, Form, Input, Row } from "antd";
import { useBooks } from "@/hooks/use-books";
import {
  maxAuthorLength,
  maxBookTitleLength,
  maxPublicationYear,
  maxPublisherLength,
  ruleMaxLength,
} from "@/configs/rules.config";
import { CustomSelect } from "../my/custom-select";

const { RangePicker } = DatePicker;

export const AdvancedSearchBooks = ({ form }) => {
  const { listOfCategories } = useBooks();

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <>
      <Row gutter={{ xs: 8, md: 16 }}>
        <Col xs={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }}>
          <Form.Item
            name="title"
            label="Title"
            rules={[ruleMaxLength(maxBookTitleLength)]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }}>
          <Form.Item
            name="author"
            label="Author"
            rules={[ruleMaxLength(maxAuthorLength)]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }}>
          <CustomSelect
            formItem={{
              name: "categories",
              label: "Categories",
            }}
            maxCount={3}
            options={listOfCategories}
          />
        </Col>
        <Col xs={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }}>
          <Form.Item
            name="publisher"
            label="Publisher"
            rules={[ruleMaxLength(maxPublisherLength)]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }}>
          <Form.Item name="publicationDate" label="Year Of Publication">
            <RangePicker
              picker="year"
              style={{ width: "100%" }}
              maxDate={maxPublicationYear}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Flex
          justify="flex-end"
          align="center"
          gap={8}
          style={{ width: "100%" }}
        >
          <Button size="medium" onClick={resetForm}>
            Reset
          </Button>
          <Button size="medium" type="primary" htmlType="submit">
            Search
          </Button>
        </Flex>
      </Row>
    </>
  );
};
