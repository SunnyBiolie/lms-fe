import { ReportAction } from "@/components/tabs-adm-statistic-page/report-action";
import { StatisticCharts } from "@/components/tabs-adm-statistic-page/statistic-charts";
import { Space } from "antd";

export default function StatisticPage() {
  return (
    <Space direction="vertical" size="large" className="h-full w-full">
      <ReportAction />
      <StatisticCharts />
    </Space>
  );
}
