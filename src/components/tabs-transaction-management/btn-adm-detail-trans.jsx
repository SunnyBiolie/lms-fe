import { Button, Col, Flex, Modal, Row, Spin, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Table_Account,
  Table_Book,
  Table_Transaction,
} from "@/configs/db.config";
import { getTransactionByIdService } from "@/services/transaction/get-by-id";
import dayjs from "dayjs";

export const BtnAdmDetailTrans = ({ record, type }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleClick = () => {
    openModal();
  };

  return (
    <>
      <Button
        icon={<EyeOutlined />}
        size="small"
        onClick={handleClick}
      ></Button>
      <MdlAdmDetailTrans
        isModalOpen={open}
        closeModal={closeModal}
        record={record}
        type={type}
      />
    </>
  );
};

const MdlAdmDetailTrans = ({ isModalOpen, closeModal, record, type }) => {
  const relation =
    record[Table_Transaction.receivedFrom] !== "SYSTEM"
      ? "Receiver"
      : record[Table_Transaction.passedFor] !== null
      ? "Passer"
      : "No";

  const mutation = useMutation({ mutationFn: getTransactionByIdService });
  const [relativeTransaction, setRelativeTransaction] = useState();

  useEffect(() => {
    if (isModalOpen && relation !== "No" && !relativeTransaction) {
      mutation.mutate(
        {
          params: {
            transactionId:
              relation === "Passer"
                ? record[Table_Transaction.passedFor]
                : record[Table_Transaction.receivedFrom],
          },
        },
        {
          onSuccess: (res) => {
            setRelativeTransaction(res.data.data);
          },
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const passer = relation === "Passer" ? record : relativeTransaction;
  const receiver = relation === "Receiver" ? record : relativeTransaction;

  return (
    <Modal
      destroyOnClose
      title="Detail of Transaction"
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
    >
      <Typography.Paragraph>
        <Typography.Text strong>
          Book title: {record[Table_Transaction.Book][Table_Book.title]}
        </Typography.Text>
      </Typography.Paragraph>
      <Row>
        {relation === "No" ? (
          <Col>
            <Typography.Paragraph>
              <Typography.Text italic strong>
                Full name:{" "}
              </Typography.Text>
              {record[Table_Transaction.Account][Table_Account.fullName]}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text italic strong>
                Borrowed at:{" "}
              </Typography.Text>
              {dayjs(record[Table_Transaction.borrowedAt]).format("DD/MM/YYYY")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text italic strong>
                Due date:{" "}
              </Typography.Text>
              {dayjs(record[Table_Transaction.dueDate]).format("DD/MM/YYYY")}
            </Typography.Paragraph>
          </Col>
        ) : relativeTransaction ? (
          <>
            <Col span={12}>
              <Typography.Paragraph strong>Passer</Typography.Paragraph>
              <Typography.Paragraph>
                <Typography.Text italic>Full name: </Typography.Text>
                {passer[Table_Transaction.Account][Table_Account.fullName]}
              </Typography.Paragraph>
              <Typography.Paragraph>
                <Typography.Text italic>Borrowed at: </Typography.Text>
                {dayjs(passer[Table_Transaction.borrowedAt]).format(
                  "DD/MM/YYYY HH:mm:ss"
                )}
              </Typography.Paragraph>
            </Col>
            <Col span={12}>
              <Typography.Paragraph strong>Receiver</Typography.Paragraph>
              <Typography.Paragraph>
                <Typography.Text italic>Full name: </Typography.Text>
                {receiver[Table_Transaction.Account][Table_Account.fullName]}
              </Typography.Paragraph>
              <Typography.Paragraph>
                <Typography.Text italic>Received at: </Typography.Text>
                {dayjs(receiver[Table_Transaction.borrowedAt]).format(
                  "DD/MM/YYYY HH:mm:ss"
                )}
              </Typography.Paragraph>
              <Typography.Paragraph>
                <Typography.Text italic>Due date: </Typography.Text>

                {dayjs(receiver[Table_Transaction.dueDate]).format(
                  "DD/MM/YYYY"
                )}
              </Typography.Paragraph>
            </Col>
          </>
        ) : (
          <Flex justify="center" className="w-full">
            <Spin />
          </Flex>
        )}
      </Row>
      {type === "returned" && (
        <Row>
          <Typography.Paragraph>
            <Typography.Text strong>
              Returned at:{" "}
              {dayjs(record[Table_Transaction.returnedAt]).format(
                "DD/MM/YYYY HH:mm:ss"
              )}
            </Typography.Text>
          </Typography.Paragraph>
        </Row>
      )}
    </Modal>
  );
};
