import { Button, Space, Spin, Table, Typography } from "antd";
import {
  Table_Account,
  Table_History,
  Table_Report,
  Table_RpAccount,
} from "@/configs/db.config";
import { EyeOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { getOverdueService } from "@/services/histories/get-overdue";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { useState } from "react";
import dayjs from "dayjs";
import { useAntDesign } from "@/hooks/use-ant-design";

const { Text } = Typography;

export const TabReportAccounts = ({ reportDetail }) => {
  const { msgApi } = useAntDesign();
  const mutationGetOverdue = useMutation({ mutationFn: getOverdueService });

  const [overdueData, setOverdueData] = useState();

  const viewOverdueDetail = (fullName, accountId, reportId) => {
    mutationGetOverdue.mutate(
      {
        accountId,
        reportId,
      },
      {
        onSuccess: (res) => {
          setOverdueData({
            fullName,
            data: res.data.data,
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
    <Space size="large" direction="vertical" className="w-full">
      <Table
        size="small"
        dataSource={reportDetail[Table_Report.ReportAccounts]}
        pagination={{
          position: ["bottomCenter"],
          hideOnSinglePage: true,
          pageSize: 5,
        }}
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
              return (
                <Button
                  disabled={record[Table_RpAccount.overdueCount] === 0}
                  icon={<EyeOutlined />}
                  size="small"
                  type="text"
                  onClick={() =>
                    viewOverdueDetail(
                      record[Table_RpAccount.Account][Table_Account.fullName],
                      record[Table_RpAccount.Account][Table_Account.id],
                      record[Table_RpAccount.reportId]
                    )
                  }
                ></Button>
              );
            },
          },
        ]}
        rowKey={(item) => item.id}
      ></Table>
      {mutationGetOverdue.isPending ? (
        <Spin className="w-full" />
      ) : (
        overdueData && (
          <Space size="small" direction="vertical" className="w-full">
            <Text strong>{overdueData.fullName}&apos;s overdue details</Text>
            <Table
              size="small"
              dataSource={overdueData.data}
              pagination={{
                position: ["bottomCenter"],
                hideOnSinglePage: true,
                pageSize: 5,
              }}
              columns={[
                {
                  title: "Book title",
                  dataIndex: Table_History.bookTitle,
                  render: (value) => {
                    return value;
                  },
                },
                {
                  title: "Due date",
                  dataIndex: Table_History.dueDates,
                  render: (value) => {
                    return dayjs(value[value.length - 1]).format(
                      "DD/MM/YYYY HH:mm:ss"
                    );
                  },
                },
                {
                  title: "Returned at",
                  dataIndex: Table_History.returnedAt,
                  render: (value) => {
                    return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
                  },
                },
              ]}
              rowKey={(item) => item.id}
            />
          </Space>
        )
      )}
    </Space>
  );
};
