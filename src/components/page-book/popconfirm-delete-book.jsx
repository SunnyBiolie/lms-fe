import { Table_Book } from "@/configs/db.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { deleteBookService } from "@/services/books/delete";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Popconfirm, Typography } from "antd";

export const PopConfirmDeleteBook = ({ book, borrowingCount, refetch }) => {
  const { msgApi } = useAntDesign();
  const mutationDeleteBook = useMutation({ mutationFn: deleteBookService });

  const handleConfirm = async () => {
    await mutationDeleteBook.mutateAsync(
      {
        params: {
          id: book[Table_Book.id],
        },
      },
      {
        onSuccess: (res) => {
          msgApi("success", res.data.message);
          refetch();
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  return (
    <Popconfirm
      title={`Delete "${book[Table_Book.title]}"?`}
      description={
        <>
          <Typography>This action cannot be undone.</Typography>
          <Typography> Are you sure you want to delete this book?</Typography>
        </>
      }
      okText="Delete"
      okButtonProps={{ danger: true }}
      placement="bottomRight"
      onConfirm={handleConfirm}
    >
      <Button
        icon={<DeleteOutlined />}
        danger
        type="primary"
        disabled={borrowingCount !== 0}
      >
        Delete
      </Button>
    </Popconfirm>
  );
};
