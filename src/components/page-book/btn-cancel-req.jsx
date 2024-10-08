import { useMutation } from "@tanstack/react-query";
import { Button, Space, Typography } from "antd";
import { Table_Transaction } from "@/configs/db.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useTransactions } from "@/hooks/use-transactions";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { cancelPassReqService } from "@/services/transaction/cancel-pass-req";

const { Text } = Typography;

export const BtnCancelReq = ({ request: transactionRequest }) => {
  const { msgApi } = useAntDesign();
  const { loadListCurrentBorrowing } = useTransactions();
  const mutationCancelReq = useMutation({ mutationFn: cancelPassReqService });

  const handleOnClick = () => {
    mutationCancelReq.mutate(
      {
        params: {
          transactionId: transactionRequest[Table_Transaction.id],
        },
      },
      {
        onSuccess: (res) => {
          msgApi("success", res.data.message);
          loadListCurrentBorrowing();
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  return (
    <Space direction="vertical" align="end">
      <Text italic underline>
        You are requesting this book to be passed on by other users
      </Text>
      <Button
        danger
        onClick={handleOnClick}
        loading={mutationCancelReq.isPending}
      >
        Cancel request
      </Button>
    </Space>
  );
};
