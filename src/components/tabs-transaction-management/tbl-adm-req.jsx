import { Table } from "antd";
import {
  Table_Account,
  Table_Book,
  Table_Transaction,
} from "@/configs/db.config";
import dayjs from "dayjs";

export const TblAdmReq = ({ tableData, loading }) => {
  const columns = [
    {
      title: "#",
      width: 50,
    },
    {
      title: "Full name",
      dataIndex: [Table_Transaction.Account],
      render: (value) => {
        return value[Table_Account.fullName];
      },
    },
    {
      title: "Book title",
      dataIndex: [Table_Transaction.Book],
      render: (value) => {
        return value[Table_Book.title];
      },
    },
    {
      title: "Requested at",
      dataIndex: [Table_Transaction.borrowedAt],
      render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey={(item) => item.id}
      loading={loading}
    />
  );
};
