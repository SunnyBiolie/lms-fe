import { Table, Typography } from "antd";
import { BtnAdmDetailTrans } from "./btn-adm-detail-trans";
import {
  Table_Account,
  Table_Book,
  Table_Transaction,
} from "@/configs/db.config";

const { Text } = Typography;

export const TblAdmBrwByAccId = ({ tableData, loading, type }) => {
  const columns = [
    {
      title: "#",
      width: 50,
      render: (_, __, index) => {
        return <Text strong>{index + 1}</Text>;
      },
      align: "center",
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
      title: "Relation",
      render: (_, record) =>
        record[Table_Transaction.receivedFrom] !== "SYSTEM"
          ? "Receiver"
          : record[Table_Transaction.passedFor] !== null
          ? "Passer"
          : "No",
    },
    {
      title: "Action",
      dataIndex: "id",
      width: 100,
      render: (_, record) => {
        return <BtnAdmDetailTrans record={record} type={type} />;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey={(item) => item.id}
      loading={loading}
      pagination={{
        hideOnSinglePage: true,
      }}
      title={() => <Text strong>
        
      </Text>}
    />
  );
};
