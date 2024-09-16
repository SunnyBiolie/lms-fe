import { useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Modal, Radio, Typography } from "antd";
import { rules } from "@/configs/admin.config";
import { Table_Book, Table_Transaction } from "@/configs/db.config";
import { createBorrowingService } from "@/services/transaction/create";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useBooks } from "@/hooks/use-books";
import { useTransactions } from "@/hooks/use-transactions";
import { requestForPassService } from "@/services/transaction/req-for-pass";
import { cancelPassReqService } from "@/services/transaction/cancel-pass-req";

export const ModalBorrowBook = ({ isModalOpen, setIsModalOpen, book }) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const { loadListOfBooks } = useBooks();
  const { currentBorrowing, passRequesting, loadListCurrentBorrowing } =
    useTransactions();
  const [form] = Form.useForm();

  const mutationCreateBorrowing = useMutation({
    mutationFn: createBorrowingService,
  });
  const mutationReqForPass = useMutation({ mutationFn: requestForPassService });
  const mutationCancelPassReq = useMutation({
    mutationFn: cancelPassReqService,
  });

  const [isLoading, setIsLoading] = useState(false);

  const index = passRequesting.findIndex(
    (t) =>
      t[Table_Transaction.bookId] === book.id &&
      t[Table_Transaction.receivedFrom] === null
  );
  const isRequesting = index !== -1;

  const [type, setType] = useState(isRequesting ? "user" : "system");

  const isBorrowing =
    currentBorrowing.findIndex(
      (t) => t.bookId === book.id && t[Table_Transaction.receivedFrom] !== null
    ) !== -1;

  if (isBorrowing) return;

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    switch (type) {
      case "system":
        if (!isRequesting) form.submit();
        break;
      case "user":
        setIsLoading(true);
        if (!isRequesting) {
          mutationReqForPass.mutate(
            {
              accountId: currentAccount.id,
              bookId: book.id,
            },
            {
              onSuccess: (res) => {
                msgApi("success", res.data.message);
                loadListCurrentBorrowing();
                handleCancel();
              },
              onError: (err) => {
                msgApi("error", err.response.data.message);
              },
              onSettled: () => setIsLoading(false),
            }
          );
        } else {
          mutationCancelPassReq.mutate(
            {
              params: {
                transactionId: passRequesting[index].id,
              },
            },
            {
              onSuccess: (res) => {
                msgApi("success", res.data.message);
                loadListCurrentBorrowing();
                handleCancel();
              },
              onError: (err) => {
                msgApi("error", err.response.data.message);
              },
              onSettled: () => setIsLoading(false),
            }
          );
        }
        break;
      default:
        throw new Error("Unknown action is not allowed: " + type);
    }
  };

  const handleSubmit = (formValues) => {
    setIsLoading(true);
    mutationCreateBorrowing.mutate(
      {
        ...formValues,
        bookId: book.id,
        accountId: currentAccount.id,
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          loadListOfBooks();
          loadListCurrentBorrowing();
          handleCancel();
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleChange = (e) => {
    setType(e.target.value);
  };

  const okText = () => {
    if (type === "system") return "Borrow";
    if (type === "user") {
      if (isRequesting) return "Cancel request";
      else return "Request";
    }
  };

  const disableOkButton = () => {
    if (isRequesting && type === "system") return true;
    else return false;
  };

  return (
    <Modal
      destroyOnClose
      open={isModalOpen}
      title={
        <Typography.Title level={5} style={{ margin: 0 }}>
          Borrow &quot;{book[Table_Book.title]}&quot;
        </Typography.Title>
      }
      onCancel={handleCancel}
      cancelText="Close"
      onOk={handleOk}
      okText={okText()}
      okButtonProps={{
        loading: isLoading,
        disabled: disableOkButton(),
      }}
    >
      <Typography.Paragraph style={{ textAlign: "center", marginBottom: 24 }}>
        written by{" "}
        <Typography.Text strong>{book[Table_Book.author]}</Typography.Text>
      </Typography.Paragraph>
      <Radio.Group
        defaultValue={type}
        buttonStyle="solid"
        onChange={handleChange}
      >
        <Radio.Button value="system">From system</Radio.Button>
        <Radio.Button value="user">Passed by others</Radio.Button>
      </Radio.Group>
      {type === "system" ? (
        <Form
          clearOnDestroy
          form={form}
          name="borrow-book"
          disabled={isLoading || isRequesting}
          layout="vertical"
          style={{ padding: "12px 0" }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name={Table_Transaction.dueDate}
            label="Return date"
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={dayjs(Date.now() + 86400000 * rules.maxDateOfBorrow)}
          >
            <DatePicker
              minDate={dayjs(Date.now())}
              maxDate={dayjs(Date.now() + 86400000 * rules.maxDateOfBorrow)}
            />
          </Form.Item>
        </Form>
      ) : isRequesting ? (
        <Typography.Paragraph
          style={{
            paddingTop: "16px",
            textIndent: "16px",
          }}
        >
          You are requesting that other users pass the book to you. You must
          cancel this request to borrow the book from the system by yourself.
          This way, you have full control over selecting the due date and
          renewing the transaction
        </Typography.Paragraph>
      ) : (
        <>
          <Typography.Paragraph
            style={{
              paddingTop: "16px",
              textIndent: "16px",
            }}
          >
            This will create a request for other users who are borrowing this
            book to pass it to you. The request will be shown when users want to
            return the book.
          </Typography.Paragraph>
          <Typography.Paragraph
            style={{
              paddingBottom: "16px",
              textIndent: "16px",
            }}
          >
            If they accept to pass the book to you, the due date will be set by
            them, ranging from 7 to 14 days, and you will not be able to renew
            the transaction
          </Typography.Paragraph>
        </>
      )}
    </Modal>
  );
};
