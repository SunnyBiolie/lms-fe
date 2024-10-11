import { Space } from "antd";
import { TableAllBooks } from "@/components/reusable/tbl-all-books";

export default function DashboardPage() {
  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }} className="section">
        <TableAllBooks />
      </Space>
    </>
  );
}
