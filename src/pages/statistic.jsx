import { ReportAction } from "@/components/tabs-adm-statistic-page/report-action";
import { StatisticCharts } from "@/components/tabs-adm-statistic-page/statistic-charts";
import { Space } from "antd";
import { useSearchParams } from "react-router-dom";

export default function StatisticPage() {
  const [searchParams] = useSearchParams();

  return (
    <Space direction="vertical" size="large" className="h-full w-full">
      <ReportAction />
      {searchParams.get("view") === "charts" && <StatisticCharts />}
    </Space>
  );
}
