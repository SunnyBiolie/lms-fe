import { useNavigate } from "react-router-dom";
import { Button, Flex, Skeleton, Table, Tag, theme } from "antd";
import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Table_Book } from "@/configs/db.config";
import { useBooks } from "@/hooks/use-books";
import { useCurrentAccount } from "@/hooks/use-current-account";

export const TableBooks = ({ paginationParams, setPaginationParams }) => {
  const { token } = theme.useToken();
  const { current, pageSize } = paginationParams;

  const navigate = useNavigate();
  const { currentAccount } = useCurrentAccount();
  const { isLoading, listOfBooks } = useBooks();

  if (!currentAccount || !listOfBooks) return <Skeleton active />;

  const handleTableChange = (pagination) => {
    setPaginationParams(pagination);
  };

  const columns = [
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
    {
      title: currentAccount.role === "ADMIN" ? "Publisher" : "Avaliable",
      dataIndex: Table_Book.publisher,
      width: currentAccount.role === "ADMIN" ? 220 : 100,
      render: (publisher, record) => {
        if (currentAccount.role === "ADMIN") return publisher;
        else
          return (
            record[Table_Book.quantity] - record._count[Table_Book.Transactions]
          );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => {
        return (
          <Button
            size="small"
            icon={<EyeOutlined />}
            iconPosition="end"
            onClick={() => {
              navigate(`/book/${record[Table_Book.id]}`);
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <Table
        bordered
        loading={isLoading}
        dataSource={listOfBooks}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          pageSizeOptions: [5, 10],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
          ...paginationParams,
        }}
        scroll={{
          x: 1200,
        }}
        onChange={handleTableChange}
        rowKey={(record) => record.id}
      />
    </>
  );
};
