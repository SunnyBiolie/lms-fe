import { TableAllBooks } from "@/components/reusable/table-all-books";
import { Space } from "antd";

export default function DashboardPage() {
  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <TableAllBooks />
      </Space>
    </>
  );
}
