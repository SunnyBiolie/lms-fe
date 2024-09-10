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

  const handleOpenModal = () => {
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
        title={
          !renewable
            ? "You reached the maximum number of renewals for this book"
            : ""
        }
      >
        <Button disabled={!renewable} size="small" onClick={handleOpenModal}>
          Renewal
        </Button>
      </Tooltip>
      <ModalRenewalBook
        isModalOpen={isModalOpen}
        onCloseModal={handleCloseModal}
        borrowingRecord={borrowingRecord}
        loadListBorrowing={loadListBorrowing}
      />
    </>
  );
};
