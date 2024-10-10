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
import { useEffect, useState } from "react";
import { Table_Book } from "@/configs/db.config";
import { CustomSelect } from "./my/custom-select";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";

const singleSearchFields = [
  Table_Book.title,
  Table_Book.author,
  "categories",
  Table_Book.publisher,
];

export const FormSearchBook = ({ listOfCategories, setSearchValues }) => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [normalModeInput, setNormalModeInput] = useState(Table_Book.title);
  const [normalSearchValue, setNormalSearchValue] = useState();
  const debouncedValue = useDebounce(normalSearchValue, 500);

  const handleChangeMode = (isAdvanced) => {
    setIsAdvancedMode(isAdvanced);
  };

  const handleNormalModeValueChange = (value) => {
    setNormalModeInput(value);
    // handleReset();
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = (values) => {
    console.log(values);
    setSearchValues(values);
  };

  useEffect(() => {
    if (!listOfCategories) return;

    if (!debouncedValue) {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!searchParams.size) {
        for (const field of singleSearchFields) {
          if (searchParams.has(field)) {
            if (field === "categories") {
              const values = searchParams.getAll(field).map((f) => ({
                value: +f,
              }));
              form.setFieldValue(field, values);
              console.log({ [field]: searchParams.getAll(field) });

              setSearchValues({ [field]: searchParams.getAll(field) });
            } else {
              const value = searchParams.get(field);
              form.setFieldValue(field, value);

              setSearchValues({ [field]: value });
            }
            setNormalModeInput(field);
            break;
          }
        }
      }
      return;
    }

    setSearchParams({ [normalModeInput]: debouncedValue[normalModeInput] });
    setSearchValues(debouncedValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfCategories, debouncedValue]);

  const handleFormValuesChange = (changedValues) => {
    if (!isAdvancedMode) {
      setNormalSearchValue(changedValues);
    }
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
      onValuesChange={handleFormValuesChange}
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
        </>
      ) : (
        <Row align="middle" justify="center">
          <Space.Compact size="middle" className="w-full">
            <Select
              value={normalModeInput}
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
