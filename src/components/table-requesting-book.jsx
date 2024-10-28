import { useMutation } from "@tanstack/react-query";
import { Button, Popconfirm, Table, Typography } from "antd";
import { Table_Book } from "@/configs/db.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useTransactions } from "@/hooks/use-transactions";
import { cancelPassReqService } from "@/services/transaction/cancel-pass-req";

const { Text } = Typography;

export const TableRequestingBook = () => {
  const { msgApi } = useAntDesign();
  const { passRequesting, loadListCurrentBorrowing } = useTransactions();
  const mutationCancelPassReq = useMutation({
    mutationFn: cancelPassReqService,
  });

  const cancelRequest = async (value) => {
    await mutationCancelPassReq.mutateAsync(
      {
        params: {
          transactionId: value,
        },
      },
      {
        onSuccess: (res) => {
          msgApi("success", res.data.message);
          loadListCurrentBorrowing();
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
        },
      }
    );
  };

  const columns = [
    {
      title: "Book title",
      dataIndex: "Book",
      render: (value) => {
        return value[Table_Book.title];
      },
    },
    {
      title: "Author name",
      dataIndex: "Book",
      render: (value) => {
        return value[Table_Book.author];
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (value) => {
        return (
          <Popconfirm
            title="Cancel the request to pass this book?"
            onConfirm={async () => cancelRequest(value)}
          >
            <Button size="small" danger>
              Cancel
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Table
      title={() => <Text strong>List of requesting</Text>}
      columns={columns}
      dataSource={passRequesting}
      rowKey={(item) => item.id}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};
