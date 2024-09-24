import { useState } from "react";
import dayjs from "dayjs";
import { Button, Modal, Space, Tooltip, Typography } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { Table_Report } from "@/configs/db.config";
import { useMutation } from "@tanstack/react-query";
import { createMonthlyReportService } from "@/services/reports/create";
import { useAntDesign } from "@/hooks/use-ant-design";

export const ButtonReport = ({ lastReport }) => {
  const month = lastReport[Table_Report.month];
  const year = lastReport[Table_Report.year];
  const disabledSubmit = new Date(Date.now()).getDate() < 3;

  const { msgApi } = useAntDesign();
  const mutationMontlyReport = useMutation({
    mutationFn: createMonthlyReportService,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const report = () => {
    const next = new Date(year, month);
    mutationMontlyReport.mutate(
      {
        month: next.getMonth() + 1,
        year: next.getFullYear(),
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

  return (
    <>
      <Tooltip
        title={
          disabledSubmit
            ? "You can only report between the 1st and the 3rd of each month"
            : ""
        }
        placement="topLeft"
      >
        <Button type="primary" disabled={disabledSubmit} onClick={openModal}>
          Report
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
        >
          <Space size="large">
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
          </Space>
        </Modal>
      )}
    </>
  );
};
