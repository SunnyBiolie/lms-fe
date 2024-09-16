import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Typography,
} from "antd";
import {
  maxAuthorLength,
  maxBookTitleLength,
  maxPublicationYear,
  maxPublisherLength,
  ruleMaxLength,
} from "@/configs/rules.config";

export const FormSearchBook = ({ listOfCategories, setSearchValues }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = (values) => {
    setSearchValues(values);
  };

  if (!listOfCategories) return <Skeleton active />;

  return (
    <Form
      name="form-search-book"
      form={form}
      layout="vertical"
      size="small"
      onFinish={handleFinish}
      className="section"
    >
      <Row>
        <Typography.Title level={5} style={{ margin: "4px 0 12px" }}>
          Search zone
        </Typography.Title>
      </Row>
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
          <Form.Item name="categories" label="Categories">
            <Select
              mode="multiple"
              options={listOfCategories}
              maxCount={3}
              optionFilterProp="label"
              suffixIcon={"Max 3"}
            ></Select>
          </Form.Item>
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
            <DatePicker.RangePicker
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
          <Button size="medium" onClick={handleReset}>
            Reset
          </Button>
          <Button size="medium" type="primary" htmlType="submit">
            Search
          </Button>
        </Flex>
      </Row>
    </Form>
  );
};
