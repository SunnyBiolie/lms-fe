import { useState } from "react";
import { Button, Tooltip } from "antd";
import { rules } from "@/configs/admin.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { ModalRenewalBook } from "../modal-renewal-book";
import { Table_Transaction } from "@/configs/db.config";

export const BtnRenewal = ({ borrowingRecord, loadListBorrowing }) => {
  const { msgApi } = useAntDesign();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renewable =
    borrowingRecord[Table_Transaction.Renewals].length <
    rules.maxTimesOfRenewal;

  const isPassed = borrowingRecord[Table_Transaction.passedFor] !== null;

  const isReceiver =
    borrowingRecord[Table_Transaction.receivedFrom] !== "SYSTEM";

  const handleOpenModal = () => {
    if (isPassed) {
      msgApi("error", "You passed this book for someone else");
      return;
    }
    if (isReceiver) {
      msgApi("error", "You did not borrow this book from the system");
      return;
    }
    if (!renewable) {
      msgApi(
        "error",
        "You reached the maximum number of renewals for this book"
      );
      return;
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Tooltip
        destroyTooltipOnHide
        title={
          isPassed
            ? "You passed this book for someone else"
            : isReceiver
            ? "You did not borrow this book from the system"
            : !renewable
            ? "You reached the maximum number of renewals for this book"
            : ""
        }
        placement="bottomLeft"
      >
        <Button
          disabled={!renewable || isPassed || isReceiver}
          size="small"
          onClick={handleOpenModal}
        >
          Renewal
        </Button>
      </Tooltip>
      {!isPassed && (
        <ModalRenewalBook
          isModalOpen={isModalOpen}
          onCloseModal={handleCloseModal}
          borrowingRecord={borrowingRecord}
          loadListBorrowing={loadListBorrowing}
        />
      )}
    </>
  );
};
