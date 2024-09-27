import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Space } from "antd";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { getAllReportsService } from "@/services/reports/get-all";
import { AllReports } from "@/components/tabs-adm-statistic-page/all-reports";
import { ReportAction } from "@/components/tabs-adm-statistic-page/report-action";
import { StatisticCharts } from "@/components/tabs-adm-statistic-page/statistic-charts";

export default function StatisticPage() {
  const [searchParams] = useSearchParams();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["all-reports"],
    queryFn: getAllReportsService,
  });

  if (isLoading) return <></>;
  if (error) {
    return checkToLogOut(error);
  }

  const reports = data.data.data;

  return (
    <Space direction="vertical" size="middle" className="h-full w-full">
      <ReportAction response={data} refetch={refetch} />
      {searchParams.get("view") === "charts" ? (
        <StatisticCharts reports={reports} />
      ) : (
        <AllReports reports={reports} />
      )}
    </Space>
  );
}
