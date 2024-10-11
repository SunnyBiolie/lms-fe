import { Table_Book } from "@/configs/db.config";
import { useBooks } from "@/hooks/use-books";
import { capitalize } from "@/lib/capitalize";
// import { useCurrentAccount } from "@/hooks/use-current-account";
import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Flex,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import { memo } from "react";
import { Link } from "react-router-dom";

export const TableSearchResult = ({
  loading,
  data,
  searchValues,
  setPaginationParams,
}) => {
  const { token } = theme.useToken();

  // const { currentAccount } = useCurrentAccount();

  const handleChange = (pagination) => {
    const { current, pageSize } = pagination;
    setPaginationParams({ current, pageSize });
  };

  if (!data) return;

  const { current, pageSize } = data.pagination;

  return (
    <div className="section">
      <Table
        loading={loading}
        dataSource={data.results}
        columns={[
          {
            title: "#",
            dataIndex: Table_Book.id,
            width: 50,
            fixed: "left",
            render: (_, __, index) => {
              return (
                <p style={{ fontWeight: 500, margin: 0 }}>
                  {(current - 1) * pageSize + index + 1}
                </p>
              );
            },
          },
          {
            title: "Title",
            dataIndex: Table_Book.title,
            width: 250,
          },
          {
            title: "Author",
            dataIndex: Table_Book.author,
            width: 220,
          },
          {
            title: "Categories",
            dataIndex: Table_Book.Categories,
            width: 250,
            render: (categories) => {
              const formatedCategories = categories.map((c) => c.name);

              return (
                <>
                  {formatedCategories.map((cat, index) => {
                    return (
                      <Tag key={index} className="category-tag" color="#999">
                        {cat}
                      </Tag>
                    );
                  })}
                </>
              );
            },
          },
          {
            title: (
              <Flex align="center" justify="center">
                Is special
              </Flex>
            ),
            dataIndex: Table_Book.isSpecial,
            width: 100,
            render: (value) => {
              return (
                value && (
                  <Flex align="center" justify="center">
                    <CheckCircleOutlined
                      style={{ color: token.colorSecondary, fontSize: "16px" }}
                    />
                  </Flex>
                )
              );
            },
          },
          // {
          //   title: "Value",
          //   dataIndex: Table_Book.price,
          //   width: 160,
          //   render: (value) => {
          //     return value.toLocaleString("it-IT", {
          //       style: "currency",
          //       currency: "VND",
          //     });
          //   },
          // },
          // {
          //   title: currentAccount.role === "ADMIN" ? "Publisher" : "Avaliable",
          //   dataIndex: Table_Book.publisher,
          //   width: currentAccount.role === "ADMIN" ? 220 : 100,
          //   render: (publisher, record) => {
          //     if (currentAccount.role === "ADMIN") return publisher;
          //     else
          //       return (
          //         record[Table_Book.quantity] -
          //         record._count[Table_Book.Transactions]
          //       );
          //   },
          // },
          {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 80,
            render: (_, record) => {
              return (
                <Link to={`/book/${record[Table_Book.id]}`}>
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    iconPosition="end"
                  />
                </Link>
              );
            },
          },
        ]}
        title={() => <TableTitle searchValues={searchValues} data={data} />}
        rowKey={(item) => item[Table_Book.id]}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: [3, 5, 10],
          current,
          pageSize,
          total: data.total,
        }}
        onChange={handleChange}
      />
    </div>
  );
};

const { Title, Text } = Typography;

const useStyles = createStyles(({ css }) => ({
  title: css`
    margin-top: 4px;
    margin-bottom: 4px !important;
  `,
}));

const TableTitle = memo(function TableTitle({ searchValues, data }) {
  const { styles } = useStyles();
  const { listOfCategories } = useBooks();

  const keys = Object.keys(searchValues);
  let items = [];

  keys.forEach((key) => {
    if (searchValues[key]) {
      if (key === Table_Book.Categories.toLowerCase()) {
        const labels = searchValues[key].map((cateId) => {
          return listOfCategories.filter((item) => item.value === cateId)[0]
            .label;
        });
        items.push({
          key: key,
          label: capitalize(key),
          children: labels.map((l, index) => {
            if (index < labels.length - 1) return `${l}, `;
            else return l;
          }),
        });
      } else if (key === Table_Book.publicationDate) {
        items.push({
          key: key,
          label: "Publication year",
          children: `${dayjs(searchValues[key][0]).format("YYYY")} - ${dayjs(
            searchValues[key][1]
          ).format("YYYY")}`,
        });
      } else {
        items.push({
          key: key,
          label: capitalize(key),
          children: searchValues[key],
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
