import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Typography } from "antd";
import { Table_Account, Table_Transaction } from "@/configs/db.config";
import { ruleRequired } from "@/configs/rules.config";
import { passBookService } from "@/services/transaction/pass-book";
import { useAntDesign } from "@/hooks/use-ant-design";
import dayjs from "dayjs";
import { useTransactions } from "@/hooks/use-transactions";

export const ModalPassBook = ({ receiverTran, borrowingRecord }) => {
  const { msgApi } = useAntDesign();
  const { loadListCurrentBorrowing } = useTransactions();
  const [form] = Form.useForm();
  const mutationPassBook = useMutation({ mutationFn: passBookService });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const passBook = (values) => {
    setLoading(true);
    mutationPassBook.mutate(
      {
        ...values,
        tranPassId: borrowingRecord[Table_Transaction.id],
        tranReceiveId: receiverTran[Table_Transaction.id],
      },
      {
        onSuccess: (res) => {
          msgApi("success", res.data.message);
          loadListCurrentBorrowing();
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <>
      <Button size="small" type="primary" onClick={openModal}>
        Pass
      </Button>
      <Modal
        destroyOnClose
        open={isModalOpen}
        title="Pass book"
        onCancel={closeModal}
        okText="Pass"
        onOk={handleOk}
        okButtonProps={{
          loading: loading,
        }}
      >
        <Typography.Paragraph>
          With this action, you will pass this book to{" "}
          <Typography.Text underline strong>
            {receiverTran[Table_Transaction.Account][Table_Account.fullName]}
          </Typography.Text>
          .
        </Typography.Paragraph>
        <Typography.Paragraph>
          You must set the due date for{" "}
          {receiverTran[Table_Transaction.Account][Table_Account.fullName]} to
          return this book, and{" "}
          {receiverTran[Table_Transaction.Account][Table_Account.fullName]}{" "}
          won&apos;t be able to renew it. Remember, you can only borrow this
          book again once{" "}
          {receiverTran[Table_Transaction.Account][Table_Account.fullName]}{" "}
          returns it.
        </Typography.Paragraph>
        <Form
          form={form}
          name="form-pass-book"
          layout="vertical"
          onFinish={passBook}
        >
          <Form.Item
            name={"dueDate"}
            label="Due date"
            rules={[ruleRequired("due date")]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              minDate={dayjs(new Date(Date.now() + 7 * 86400000))}
              maxDate={dayjs(new Date(Date.now() + 14 * 86400000))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
