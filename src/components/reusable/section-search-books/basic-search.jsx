import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CustomSelect } from "@/components/my/custom-select";
import { Table_Book } from "@/configs/db.config";
import { capitalize } from "@/lib/capitalize";
import { createStyles } from "antd-style";
import { useBooks } from "@/hooks/use-books";
import { useDebounce } from "@/hooks/use-debounce";
import { validSearchParams } from "@/lib/valid-search-params";
import { useFirstRender } from "@/hooks/use-first-render";

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

export const BasicSearchBooks = ({ onSearch }) => {
  const { styles } = useStyles();
  const { listOfCategories } = useBooks();
  const [form] = Form.useForm();

  const [searchBy, setSearchBy] = useState(listSearchBy[0]);
  const [searchValue, setSearchValue] = useState();
  const debouncedValue = useDebounce(searchValue, 750);

  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (isFirstRender) return;

    const validValue = validSearchParams(debouncedValue);
    onSearch(validValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const changeSearchBy = (value) => {
    setSearchBy(value);
  };

  const changeSearchValue = (changedValues) => {
    setSearchValue(changedValues);
  };

  return (
    <Form
      form={form}
      name="form-basic-search"
      onValuesChange={changeSearchValue}
    >
      <Space.Compact size="middle" className="w-full">
        <Select
          value={searchBy}
          defaultValue={searchBy}
          className={styles.select}
          onChange={changeSearchBy}
          options={searchByOptions}
        ></Select>
        {searchBy === "categories" ? (
          <CustomSelect
            formItem={{
              name: searchBy,
              className: "w-full",
            }}
            maxCount={3}
            options={listOfCategories}
          />
        ) : (
          <Form.Item name={searchBy} className="w-full">
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
