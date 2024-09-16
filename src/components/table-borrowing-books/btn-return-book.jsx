import { useMutation } from "@tanstack/react-query";
import { Button, Collapse, Modal, Tooltip } from "antd";
import { returnBookService } from "@/services/transaction/return";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useBooks } from "@/hooks/use-books";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { Table_Transaction } from "@/configs/db.config";
import { useState } from "react";
import { TableRequesting } from "./table-requesting";

export const BtnReturnBook = ({ borrowingRecord, loadListBorrowing }) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const { loadListOfBooks } = useBooks();
  const mutationReturnBook = useMutation({ mutationFn: returnBookService });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    await mutationReturnBook.mutateAsync(
      { ...borrowingRecord, userName: currentAccount.userName },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          loadListBorrowing();
          loadListOfBooks();
        },
        onError: (exiosError) =>
          msgApi("error", exiosError.response.data.message),
        // onSettled: () => setLoading(false),
      }
    );
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const isPassed = borrowingRecord[Table_Transaction.passedFor] !== null;
  const isReceiver =
    borrowingRecord[Table_Transaction.receivedFrom] !== "SYSTEM";

  const items = !isReceiver
    ? [
        {
          key: "1",
          label: "Return this book now",
          children: (
            <Button loading={loading} onClick={confirm}>
              Return
            </Button>
          ),
        },
        {
          key: "2",
          label: "Or pass it to one of the users below",
          children: (
            <TableRequesting
              borrowingRecord={borrowingRecord}
              disabled={loading}
            />
          ),
        },
      ]
    : [
        {
          key: "1",
          label: "Return this book now",
          children: (
            <Button loading={loading} onClick={confirm}>
              Return
            </Button>
          ),
        },
      ];

  return (
    <>
      <Tooltip
        destroyTooltipOnHide
        title={isPassed ? "You passed this book for someone else" : ""}
        placement="bottomLeft"
      >
        <Button disabled={isPassed} size="small" onClick={openModal}>
          Return
        </Button>
      </Tooltip>
      {!isPassed && (
        <Modal
          destroyOnClose
          title="Return or pass"
          open={open}
          onCancel={closeModal}
          footer={null}
        >
          <Collapse items={items} defaultActiveKey={1} accordion ghost />
        </Modal>
      )}
    </>
  );
};
