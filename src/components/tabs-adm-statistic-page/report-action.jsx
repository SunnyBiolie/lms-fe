import { useSearchParams } from "react-router-dom";
import { Button, Flex, Space, Typography } from "antd";
import { Table_Report } from "@/configs/db.config";
import { ButtonReport } from "./button-report";

export const ReportAction = ({ response, refetch }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const lastReport = response.data.data[0];
  const month = lastReport[Table_Report.month];
  const year = lastReport[Table_Report.year];

  const changeView = () => {
    const view = searchParams.get("view");

    if (view === "charts") {
      setSearchParams({}, { replace: true });
    } else setSearchParams({ view: "charts" }, { replace: true });
  };

  return (
    <Flex className="section" align="center" justify="space-between">
      <div>
        <Typography.Text strong>Last report: </Typography.Text>
        <Typography.Text>{`${Intl.DateTimeFormat("en", {
          month: "long",
        }).format(new Date(year, month - 1))}, ${year}`}</Typography.Text>
      </div>
      <Space>
        <Button onClick={changeView}>
          {searchParams.get("view") === "charts"
            ? "All reports"
            : "View charts"}
        </Button>
        <ButtonReport lastReport={lastReport} refetch={refetch} />
      </Space>
    </Flex>
  );
};
