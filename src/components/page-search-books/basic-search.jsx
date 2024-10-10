import { useState } from "react";
import { Button, Form, Input, Row, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CustomSelect } from "../my/custom-select";
import { useBooks } from "@/hooks/use-books";
import { Table_Book } from "@/configs/db.config";
import { capitalize } from "@/lib/capitalize";
import { createStyles } from "antd-style";

const basicSearchFields = [
  Table_Book.title,
  Table_Book.author,
  Table_Book.Categories.toLowerCase(),
  Table_Book.publisher,
];

const searchByOptions = basicSearchFields.map((item) => ({
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

export const BasicSearchBooks = () => {
  const { styles } = useStyles();
  const { listOfCategories } = useBooks();

  const [searchBy, setSearchBy] = useState(basicSearchFields[0]);
  const [searchValue, setSearchValue] = useState();

  const handleChangeSearchBy = (value) => {
    setSearchBy(value);
  };

  return (
    <Row align="middle" justify="center">
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
    </Row>
  );
};
