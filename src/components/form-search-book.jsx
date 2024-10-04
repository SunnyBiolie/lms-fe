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
  Space,
  Switch,
  Typography,
} from "antd";
import {
  maxAuthorLength,
  maxBookTitleLength,
  maxPublicationYear,
  maxPublisherLength,
  ruleMaxLength,
} from "@/configs/rules.config";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Table_Book } from "@/configs/db.config";
import { CustomSelect } from "./my/custom-select";

export const FormSearchBook = ({ listOfCategories, setSearchValues }) => {
  const [form] = Form.useForm();

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [normalModeInput, setNormalModeInput] = useState(Table_Book.title);

  const handleChangeMode = (isAdvanced) => {
    setIsAdvancedMode(isAdvanced);
    handleReset();
  };

  const handleNormalModeValueChange = (value) => {
    setNormalModeInput(value);
  };

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
      <Row
        align="middle"
        justify="space-between"
        style={{ marginBottom: "12px" }}
      >
        <Typography.Title level={5} style={{ margin: "4px 0 4px" }}>
          Search zone
        </Typography.Title>
        <Switch
          size="medium"
          checkedChildren="Advanced"
          unCheckedChildren="Normal"
          defaultChecked={isAdvancedMode}
          onChange={handleChangeMode}
        />
      </Row>
      {isAdvancedMode ? (
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
              <Form.Item name="categories" label="Categories">
                <Select
                  mode="multiple"
                  options={listOfCategories}
                  maxCount={3}
                  optionFilterProp="label"
                  suffixIcon={"Max 3"}
                ></Select>
                {/* <CustomSelect maxCount={3} options={listOfCategories} /> */}
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
            {/* <Col xs={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }}>
              <Form.Item name="isSpecial" valuePropName="checked">
                <Checkbox>a</Checkbox>
              </Form.Item>
            </Col> */}
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
        </>
      ) : (
        <Row align="middle" justify="center">
          <Space.Compact size="middle" className="w-full">
            <Select
              defaultValue={normalModeInput}
              style={{
                width: 140,
              }}
              onChange={handleNormalModeValueChange}
              options={[
                {
                  label: "Title",
                  value: "title",
                },
                {
                  label: "Author",
                  value: "author",
                },
                {
                  label: "Categories",
                  value: "categories",
                },
                {
                  label: "Publisher",
                  value: "publisher",
                },
              ]}
            ></Select>
            {normalModeInput === "categories" ? (
              <CustomSelect
                formItem={{
                  name: normalModeInput,
                  className: "w-full",
                }}
                maxCount={3}
                options={listOfCategories}
              />
            ) : (
              <Form.Item name={normalModeInput} className="w-full">
                <Input />
              </Form.Item>
            )}
            <Button
              icon={<SearchOutlined />}
              type="primary"
              htmlType="submit"
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            ></Button>
          </Space.Compact>
        </Row>
      )}
    </Form>
  );
};
