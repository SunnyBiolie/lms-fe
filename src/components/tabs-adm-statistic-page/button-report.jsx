import { useState } from "react";
import dayjs from "dayjs";
import { Button, Flex, Modal, Space, Spin, Tooltip, Typography } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { Table_Report } from "@/configs/db.config";
import { useMutation } from "@tanstack/react-query";
import { createMonthlyReportService } from "@/services/reports/create";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { calculateMembershipService } from "@/services/reports/calculate-membership";
import { useSearchParams } from "react-router-dom";

export const ButtonReport = ({ lastReport }) => {
  const month = lastReport[Table_Report.month];
  const year = lastReport[Table_Report.year];
  // const disabledSubmit = new Date() < new Date(year, month + 1);
  const disabledSubmit = new Date() < new Date(2024, 8, 25);

  const [_, setSearchParams] = useSearchParams();

  const { msgApi } = useAntDesign();
  const mutationMontlyReport = useMutation({
    mutationFn: createMonthlyReportService,
  });
  const mutationCalculateMembership = useMutation({
    mutationFn: calculateMembershipService,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // return;
    setIsModalOpen(false);
  };

  const report = () => {
    // Cho trường hợp month dưới db là 12 --> new Date(2024, 12) --> Wed Jan 01 2025 00:00:00 GMT+0700 (Giờ Đông Dương)
    const next = new Date(year, month);
    mutationMontlyReport.mutate(
      {
        month: next.getMonth() + 1,
        year: next.getFullYear(),
      },
      {
        onSuccess: (res) => {
          console.log(res.data.data);
          calculateMembership(res.data.data.Report);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  const calculateMembership = (report) => {
    mutationCalculateMembership.mutate(
      {
        report,
      },
      {
        onSuccess: (res) => {
          console.log(res.data.data);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
        },
      }
    );
  };

  const handleViewAllReports = () => {
    if (mutationCalculateMembership.data) {
      setSearchParams({ view: "all-reports" }, { replace: true });
      closeModal();
    }
  };

  return (
    <>
      <Tooltip
        title={
          disabledSubmit
            ? `The time to report for ${Intl.DateTimeFormat("en", {
                month: "long",
              }).format(new Date(year, month))} has not arrived yet`
            : ""
        }
        placement="topLeft"
      >
        <Button
          type={mutationMontlyReport.data ? "default" : "primary"}
          disabled={disabledSubmit}
          onClick={openModal}
        >
          {mutationMontlyReport.data ? "Reported" : "Report"}
        </Button>
      </Tooltip>
      {!disabledSubmit && (
        <Modal
          destroyOnClose
          open={isModalOpen}
          title="Monthly report"
          onCancel={closeModal}
          okText="Report"
          onOk={report}
          okButtonProps={{
            loading: mutationMontlyReport.isPending,
          }}
          footer={(originNode) => {
            if (mutationMontlyReport.isSuccess) return null;
            else return originNode;
          }}
        >
          <Typography.Paragraph>
            <Flex gap="large" justify="center">
              <Typography>
                <Typography.Text strong>From: </Typography.Text>
                <Typography.Text italic>
                  {dayjs(new Date(year, month, 1)).format("DD/MM/YYYY")}
                </Typography.Text>
              </Typography>
              <SwapRightOutlined />
              <Typography>
                <Typography.Text strong>To: </Typography.Text>
                <Typography.Text italic>
                  {dayjs(new Date(year, month + 1, 0)).format("DD/MM/YYYY")}
                </Typography.Text>
              </Typography>
            </Flex>
          </Typography.Paragraph>
          {!mutationMontlyReport.data ? (
            <Typography>
              The system will generate monthly transaction reports.
            </Typography>
          ) : (
            <Space direction="vertical">
              <Typography.Paragraph>
                <Typography.Text>
                  The transactions were made by{" "}
                  <Typography.Text italic strong>
                    {mutationMontlyReport.data.data.data.ReportAccounts}{" "}
                    accounts
                  </Typography.Text>{" "}
                  and involved{" "}
                  <Typography.Text italic strong>
                    {mutationMontlyReport.data.data.data.ReportBooks} books
                  </Typography.Text>
                  .
                </Typography.Text>
              </Typography.Paragraph>
              {mutationCalculateMembership.isPending && (
                <Flex gap="small" align="center">
                  <Spin size="small" />
                  Calculating membership role...
                </Flex>
              )}
              {mutationCalculateMembership.isSuccess && (
                <>
                  <Typography.Paragraph>
                    <Typography.Text>
                      There are{" "}
                      <Typography.Text italic strong>
                        {mutationCalculateMembership.data.data.data.members}{" "}
                        accounts
                      </Typography.Text>{" "}
                      upgraded to MEMBER and{" "}
                      <Typography.Text italic strong>
                        {mutationCalculateMembership.data.data.data.vips}{" "}
                        accounts
                      </Typography.Text>{" "}
                      upgraded to VIP.
                    </Typography.Text>
                  </Typography.Paragraph>
                  <Typography.Link onClick={handleViewAllReports}>
                    View details here
                  </Typography.Link>
                </>
              )}
            </Space>
          )}
        </Modal>
      )}
    </>
  );
};
