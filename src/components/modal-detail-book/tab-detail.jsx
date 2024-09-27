import dayjs from "dayjs";
import { Col, Row, Tag } from "antd";
import { createStyles } from "antd-style";
import { Table_Book } from "@/configs/db.config";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  row: css`
    padding: 12px 0;
    margin: 0 8px !important;
    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  `,
  key: css`
    font-weight: 500;
  `,
}));

export const TabDetail = ({ bookData }) => {
  const { styles } = useStyles();

  if (!bookData) return;

  const convertDataForTable = (bookData) => {
    return {
      ["Title"]: bookData[Table_Book.title],
      ["Author"]: bookData[Table_Book.author],
      ["Publisher"]: bookData[Table_Book[3]],
      ["Categories"]: bookData[Table_Book[9]],
      ["Year Of Publication"]: bookData[Table_Book.publicationDate],
      ["Value"]: bookData[Table_Book.price].toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      }),
      ["Quantity"]: bookData[Table_Book.quantity],
    };
  };

  const keys = Object.keys(convertDataForTable(bookData));
  const values = Object.values(convertDataForTable(bookData));

  return (
    <>
      {keys.map((key, index) => (
        <Row key={key} className={styles.row} gutter={16}>
          <Col span={8} className={styles.key}>
            {key}:
          </Col>
          <Col span={16}>
            {key === "Categories"
              ? values[index].map((c) => (
                  <Tag key={c.id} className="category-tag">
                    {c.name}
                  </Tag>
                ))
              : key === "Year Of Publication"
              ? dayjs(values[index]).format("YYYY")
              : values[index]}
          </Col>
        </Row>
      ))}
    </>
  );
};
