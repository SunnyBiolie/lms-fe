import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Flex, Spin, Table, Tabs, Typography } from "antd";
import { createStyles } from "antd-style";
import {
  Table_Account,
  Table_Book,
  Table_MembershipLogs,
  Table_Report,
  Table_RpBook,
} from "@/configs/db.config";
import { detailReportService } from "@/services/reports/detail";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { SelectDate } from "./all-report/select-date";
import { TabReportAccounts } from "./all-report/tab-rp-accounts";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  `,
}));

const { Paragraph } = Typography;

export const AllReports = ({ reports }) => {
  const { styles, cx } = useStyles();

  const { msgApi } = useAntDesign();
  const mutationDetailReport = useMutation({ mutationFn: detailReportService });

  const [reportDetail, setReportDetail] = useState();

  const viewDetailOfReport = (reportId) => {
    mutationDetailReport.mutate(
      {
        params: {
          reportId,
        },
      },
      {
        onSuccess: (res) => {
          setReportDetail({
            report: res.data.data.report,
            [Table_Report.ReportAccounts]:
              res.data.data[Table_Report.ReportAccounts],
            [Table_Report.ReportBooks]: res.data.data[Table_Report.ReportBooks],
            [Table_Report.MembershipLogs]:
              res.data.data[Table_Report.MembershipLogs],
          });
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  return (
    <Flex vertical>
      <Paragraph strong underline style={{ padding: "8px 16px" }}>
        Current view: All reports
      </Paragraph>
      <Flex gap={8}>
        <div className={cx(styles.container, "section w-full")}>
          {mutationDetailReport.isPending ? (
            <Spin />
          ) : reportDetail ? (
            <Flex vertical className="w-full">
              <Paragraph strong>
                Working on reports in{" "}
                {Intl.DateTimeFormat("en", { month: "long" }).format(
                  new Date(
                    reportDetail.report[Table_Report.year],
                    reportDetail.report[Table_Report.month] - 1
                  )
                )}
                , {reportDetail.report[Table_Report.year]}
              </Paragraph>
              <Tabs
                items={[
                  {
                    key: "accounts",
                    label: "Accounts",
                    children: <TabReportAccounts reportDetail={reportDetail} />,
                  },
                  {
                    key: "books",
                    label: "Books",
                    children: (
                      <Table
                        size="small"
                        dataSource={reportDetail[Table_Report.ReportBooks]}
                        pagination={{
                          position: ["bottomCenter"],
                          hideOnSinglePage: true,
                          pageSize: 5,
                        }}
                        columns={[
                          {
                            title: "Title",
                            dataIndex: Table_RpBook.Book,
                            render: (value) => {
                              return value[Table_Book.title];
                            },
                          },
                          {
                            title: "Borrow count",
                            dataIndex: Table_RpBook.borrowedCount,
                          },
                        ]}
                        rowKey={(item) => item.id}
                      ></Table>
                    ),
                  },
                  {
                    key: "membership",
                    label: "Membership",
                    children: (
                      <Table
                        size="small"
                        dataSource={reportDetail[Table_Report.MembershipLogs]}
                        pagination={{
                          position: ["bottomCenter"],
                          hideOnSinglePage: true,
                          pageSize: 5,
                        }}
                        columns={[
                          {
                            title: "Full name",
                            dataIndex: Table_MembershipLogs.Account,
                            render: (value) => {
                              return value[Table_Account.fullName];
                            },
                          },
                          {
                            title: "Upgraded to",
                            dataIndex: Table_MembershipLogs.to,
                          },
                        ]}
                        rowKey={(item) => item.id}
                      ></Table>
                    ),
                  },
                ]}
              />
            </Flex>
          ) : (
            "Select time to display data"
          )}
        </div>
        <SelectDate reports={reports} onSelect={viewDetailOfReport} />
      </Flex>
    </Flex>
  );
};
