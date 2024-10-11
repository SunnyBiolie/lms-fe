import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { createStyles } from "antd-style";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { capitalize } from "@/lib/capitalize";
import { getAllBooksService } from "@/services/books/get-all";
import { Table_Book } from "@/configs/db.config";
import { ListCategories } from "./list-categories";
import { Link } from "react-router-dom";
import { noImage } from "@/assets/no-imge";

const { Text } = Typography;

const useStyles = createStyles(({ token, css }) => ({
  tableTitle: css`
    font-size: 16px;
  `,
  coverImage: css`
    height: 64px;
    aspect-ratio: 3/4;
    border-radius: 4px;
    border: 1px solid #ccc;
  `,
  iconIsSpecialYes: css`
    color: ${token.colorSecondary};
    font-size: 16px;
  `,
  iconIsSpecialNo: css`
    color: #ccc;
    font-size: 16px;
  `,
}));

export const TableAllBooks = () => {
  const { styles } = useStyles();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: ["all-books"],
    queryFn: () =>
      getAllBooksService({
        params: {
          current,
          pageSize,
        },
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize]);

  if (error) checkToLogOut(error);

  const { listBooks, total } = data
    ? data.data.data
    : { listBooks: [], total: 0 };

  const columns = [
    {
      title: "#",
      dataIndex: Table_Book.id,
      render: (_, __, index) => {
        return (
          <Text strong>
            {isFetching ? "#" : (current - 1) * pageSize + (index + 1)}
          </Text>
        );
      },
      width: 60,
      align: "center",
      fixed: "left",
    },
    {
      title: "Cover",
      dataIndex: Table_Book.imageLink,
      render: (value) => {
        return (
          <img
            src={value ? `${value}?tr=ar-3-4,h-50` : noImage}
            className={styles.coverImage}
          ></img>
        );
      },
      width: 100,
      align: "center",
    },
    {
      title: capitalize(Table_Book.title),
      dataIndex: Table_Book.title,
    },
    {
      title: capitalize(Table_Book.author),
      dataIndex: Table_Book.author,
    },
    {
      title: capitalize(Table_Book.Categories),
      dataIndex: Table_Book.Categories,
      render: (value) => {
        return <ListCategories categories={value} isLink />;
      },
    },
    {
      title: "Is special",
      dataIndex: Table_Book.isSpecial,
      render: (value) => {
        return value ? (
          <CheckCircleOutlined className={styles.iconIsSpecialYes} />
        ) : (
          <CloseCircleOutlined className={styles.iconIsSpecialNo} />
        );
      },
      width: 120,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: Table_Book.id,
      render: (value) => {
        return (
          <Link to={`/book/${value}`}>
            <Button icon={<LinkOutlined />} size="small" />
          </Link>
        );
      },
      width: 100,
      align: "center",
      fixed: "right",
    },
  ];

  const handleChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
  };

  return (
    <Table
      dataSource={listBooks}
      columns={columns}
      title={() => (
        <Text strong className={styles.tableTitle}>
          List of all books
        </Text>
      )}
      size="large"
      rowKey={(item) => item[Table_Book.id]}
      pagination={{
        position: ["bottomCenter"],
        current,
        pageSize,
        total,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: [2, 5, 10],
        showSizeChanger: true,
        onChange: handleChange,
      }}
      scroll={{
        x: 1200,
      }}
      loading={isFetching}
    />
  );
};
