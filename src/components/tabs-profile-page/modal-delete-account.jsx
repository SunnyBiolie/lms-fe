import { Table_Account } from "@/configs/db.config";
import { routeAuth } from "@/configs/route.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { deleteAccountService } from "@/services/accounts/delete";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
import { useState } from "react";

export const ModalDeleteAccount = ({ isModalOpen, closeModal }) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const [form] = Form.useForm();
  const mutationDeleteAccount = useMutation({
    mutationFn: deleteAccountService,
  });

  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!currentAccount) return;

  const handleCancel = () => {
    closeModal();
  };

  const handleValuesChange = (changedValues) => {
    setCheck(
      changedValues.confirmText === currentAccount[Table_Account.fullName]
    );
  };

  const handleOk = () => {
    setLoading(true);
    mutationDeleteAccount.mutate(
      {
        params: {
          accountId: currentAccount.id,
        },
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          window.location.href = routeAuth.logIn.pathname;
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <Modal
      open={isModalOpen}
      title="Delete this account"
      onCancel={handleCancel}
      footer={() => (
        <>
          <Button
            loading={loading}
            disabled={!check}
            type="primary"
            className="w-full"
            onClick={handleOk}
          >
            Delete this account
          </Button>
        </>
      )}
    >
      <Typography.Paragraph strong>{`To confirm, type "${
        currentAccount[Table_Account.fullName]
      }" in the box below`}</Typography.Paragraph>
      <Form
        form={form}
        name="delete-account"
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="confirmText">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
