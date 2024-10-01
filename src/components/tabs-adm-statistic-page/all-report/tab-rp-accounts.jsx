import { Button, Table } from "antd";
import {
  Table_Account,
  Table_Report,
  Table_RpAccount,
} from "@/configs/db.config";
import { EyeOutlined } from "@ant-design/icons";

export const TabReportAccounts = ({ reportDetail }) => {
  return (
    <Table
      size="small"
      dataSource={reportDetail[Table_Report.ReportAccounts]}
      columns={[
        {
          title: "Full name",
          dataIndex: Table_RpAccount.Account,
          render: (value) => {
            return value[Table_Account.fullName];
          },
        },
        {
          title: "Borrow count",
          dataIndex: Table_RpAccount.borrowCount,
        },
        {
          title: "Overdue count",
          dataIndex: Table_RpAccount.overdueCount,
        },
        {
          title: "Action",
          render: (_, record) => {
            return <Button icon={<EyeOutlined />} size="small" type="text" />;
          },
        },
      ]}
      rowKey={(item) => item.id}
    ></Table>
  );
};
