import { memo } from "react";
import { Descriptions, Flex, Typography } from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import { Table_Book } from "@/configs/db.config";
import { capitalize } from "@/lib/capitalize";
import { useBooks } from "@/hooks/use-books";
import { ListCategories } from "../list-categories";

const { Title, Text } = Typography;

const useStyles = createStyles(({ css }) => ({
  title: css`
    margin-top: 4px;
    margin-bottom: 4px !important;
  `,
}));

export const ResultsTitle = memo(function ResultsTitle({ searchParams, data }) {
  const { styles } = useStyles();
  const { listOfCategories } = useBooks();

  const keys = Object.keys(searchParams || {});
  let items = [];

  keys.forEach((key) => {
    if (searchParams[key]) {
      switch (key) {
        case Table_Book.Categories.toLowerCase():
          {
            const exist = [];
            searchParams[key].forEach((cateId) => {
              exist.push(
                ...listOfCategories.filter((item) => item.value === cateId)
              );
            });
            const categories = exist.map((item) => {
              return {
                id: item.value,
                name: item.label,
              };
            });
            items.push({
              key: key,
              label: capitalize(key),
              children: <ListCategories categories={categories} />,
            });
          }
          break;
        case Table_Book.publicationDate:
          items.push({
            key: key,
            label: "Publication year",
            children: `${dayjs(searchParams[key][0]).format("YYYY")} - ${dayjs(
              searchParams[key][1]
            ).format("YYYY")}`,
          });
          break;
        default:
          items.push({
            key: key,
            label: capitalize(key),
            children: searchParams[key],
          });
      }
    }
  });

  return (
    <Flex vertical>
      <Flex gap={8} align="center">
        <Title level={5} className={styles.title}>
          {data.total} results
        </Title>
        <Text className={styles.title}>for search by</Text>
      </Flex>
      <Descriptions items={items} />
    </Flex>
  );
});
