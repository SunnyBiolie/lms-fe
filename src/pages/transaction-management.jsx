import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import { FormAdmSearchTrans } from "@/components/tabs-transaction-management/form-adm-search-trans";

const keys = ["borrowing", "requesting", "returned"];

export default function TransactionManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const items = [
    {
      key: keys[0],
      label: "Borrowing",
      children: <FormAdmSearchTrans type={keys[0]} />,
    },
    {
      key: keys[1],
      label: "Requesting",
      children: <FormAdmSearchTrans type={keys[1]} />,
    },
    {
      key: keys[2],
      label: "Returned",
      children: <FormAdmSearchTrans type={keys[2]} />,
    },
  ];

  const handleTabClick = (activeKey) => {
    setSearchParams({ tab: activeKey });
  };

  return (
    <div className="section">
      <Tabs
        items={items}
        defaultActiveKey={searchParams.get("tab")}
        onTabClick={handleTabClick}
      />
    </div>
  );
}
