import { useMutation } from "@tanstack/react-query";
import { Button, Popconfirm } from "antd";
import { returnBookService } from "@/services/transaction/return";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useBooks } from "@/hooks/use-books";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { Table_Book } from "@/configs/db.config";

export const BtnReturnBook = ({ borrowingRecord, loadListBorrowing }) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const { loadListOfBooks } = useBooks();
  const mutationReturnBook = useMutation({ mutationFn: returnBookService });

  const confirm = async () => {
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
      }
    );
  };

  return (
    <Popconfirm
      destroyTooltipOnHide
      title="Return book"
      description={`Return "${borrowingRecord[Table_Book.title]}" now`}
      placement="topRight"
      onConfirm={confirm}
    >
      <Button size="small">Return</Button>
    </Popconfirm>
  );
};
