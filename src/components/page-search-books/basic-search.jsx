import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Form, Input, Select, Skeleton, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { Table_Book } from "@/configs/db.config";
import { capitalize } from "@/lib/capitalize";
import { useBooks } from "@/hooks/use-books";
import { useDebounce } from "@/hooks/use-debounce";
import { CustomSelect } from "../my/custom-select";

const listSearchBy = [
  Table_Book.title,
  Table_Book.author,
  Table_Book.Categories.toLowerCase(),
  Table_Book.publisher,
];

const searchByOptions = listSearchBy.map((item) => ({
  label: capitalize(item),
  value: item.toLowerCase(),
}));

const useStyles = createStyles(({ css }) => ({
  select: css`
    width: 125px;
    flex-shrink: 0;
  `,
  button: css`
    padding-left: 20px,
    padding-right: 20px,
  `,
}));

export const BasicSearchBooks = ({ setSearchValues }) => {
  const { styles } = useStyles();
  const { listOfCategories } = useBooks();
  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  // Gán giá trị từ searchParams đối với lần đầu truy cập
  const initial = useMemo(() => {
    const keys = [...searchParams.keys()];
    // Chỉ lấy query-key đầu tiên
    if (keys[0]) {
      for (const searchBy of listSearchBy) {
        // Kiểm tra hợp lệ với các tiêu chí tìm kiếm
        if (keys[0] === searchBy) {
          if (searchBy === Table_Book.Categories.toLowerCase()) {
            const values = searchParams.getAll(searchBy).map((cate) => +cate);
            return {
              key: searchBy,
              value: { [searchBy]: values },
            };
          } else {
            return {
              key: searchBy,
              value: { [searchBy]: searchParams.get(searchBy) },
            };
          }
        }
      }
    }

    return {
      key: listSearchBy[0],
      value: "",
    };
  }, [searchParams]);

  const [searchBy, setSearchBy] = useState(initial.key);
  const [searchValue, setSearchValue] = useState(initial.value);
  const debouncedValue = useDebounce(searchValue);

  useEffect(() => {
    if (!debouncedValue) {
      return;
    }
    setSearchParams({ [searchBy]: debouncedValue[searchBy] });
    if (!debouncedValue[searchBy]) {
      setSearchValues(undefined);
    } else {
      setSearchValues(debouncedValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  if (!listOfCategories)
    return <Skeleton active round paragraph={{ rows: 2 }} title={false} />;

  const handleChangeSearchBy = (value) => {
    setSearchBy(value);
  };

  const handleChangeSearchValues = (changedValues) => {
    setSearchValue(changedValues);
  };

  return (
    <Form
      form={form}
      name="form-basic-search"
      onValuesChange={handleChangeSearchValues}
    >
      <Space.Compact size="middle" className="w-full">
        <Select
          value={searchBy}
          defaultValue={searchBy}
          className={styles.select}
          onChange={handleChangeSearchBy}
          options={searchByOptions}
        ></Select>
        {searchBy === "categories" ? (
          <CustomSelect
            formItem={{
              name: searchBy,
              className: "w-full",
              initialValue: searchValue[searchBy],
            }}
            maxCount={3}
            options={listOfCategories}
          />
        ) : (
          <Form.Item
            name={searchBy}
            className="w-full"
            initialValue={searchValue[searchBy]}
          >
            <Input />
          </Form.Item>
        )}
        <Button
          icon={<SearchOutlined />}
          type="primary"
          htmlType="submit"
          className={styles.button}
        ></Button>
      </Space.Compact>
    </Form>
  );
};
