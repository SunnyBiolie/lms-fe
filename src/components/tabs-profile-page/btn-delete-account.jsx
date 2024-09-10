import { useState } from "react";
import { Button, Space, Typography } from "antd";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useTransactions } from "@/hooks/use-transactions";
import { ModalDeleteAccount } from "./modal-delete-account";
import { Link } from "react-router-dom";
import { routeUser } from "@/configs/route.config";

export const BtnDeleteAccount = () => {
  const { currentAccount } = useCurrentAccount();
  const { isEmpty } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentAccount) return;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Space direction="vertical">
        {!isEmpty && (
          <Typography.Paragraph>
            You have pending transaction(s),{" "}
            <Link to={routeUser.history}>view all</Link>
          </Typography.Paragraph>
        )}
        <Button disabled={!isEmpty} danger onClick={openModal}>
          Delete this account
        </Button>
      </Space>
      <ModalDeleteAccount isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
