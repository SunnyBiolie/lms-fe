import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Space, Typography } from "antd";
import { getAllReportsService } from "@/services/reports/get-all";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { ButtonReport } from "./button-report";
import { Table_Report } from "@/configs/db.config";

export const ReportAction = () => {
  const {
    isLoading,
    error,
    data: response,
  } = useQuery({
    queryKey: ["all-reports"],
    queryFn: getAllReportsService,
  });

  if (isLoading) return <></>;
  if (error) {
    return checkToLogOut(error);
  }

  const lastReport = response.data.data[0];
  const month = lastReport[Table_Report.month];
  const year = lastReport[Table_Report.year];

  return (
    <Flex className="section" align="center" justify="space-between">
      <div>
        <Typography.Text strong>Last report: </Typography.Text>
        <Typography.Text>{`${Intl.DateTimeFormat("en", {
          month: "long",
        }).format(new Date(year, month - 1))}, ${year}`}</Typography.Text>
      </div>
      <Space>
        <Button>View previous</Button>
        <ButtonReport lastReport={lastReport} />
      </Space>
    </Flex>
  );
};
