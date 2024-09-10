import { useMutation } from "@tanstack/react-query";
import { Popconfirm, Button, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteBookService } from "@/services/books/delete";
import { useAntDesign } from "@/hooks/use-ant-design";

export const BtnDeleteBook = ({
  disabled,
  isLast,
  bookId,
  loadListOfBooks,
}) => {
  const { msgApi } = useAntDesign();
  
  const mutationDeleteBook = useMutation({ mutationFn: deleteBookService });

  if (disabled)
    return (
      <Tooltip title={"This book is being borrowed"} placement="topLeft">
        <Button
          disabled
          size="small"
          type="default"
          icon={<DeleteOutlined />}
        />
      </Tooltip>
    );

  const handleDeleteBook = async () => {
    await mutationDeleteBook.mutateAsync(
      {
        params: { id: bookId },
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          if (isLast) loadListOfBooks("deleteLastItem");
          else loadListOfBooks();
        },
        onError: (axiosError) =>
          msgApi("success", axiosError.response.data.message),
      }
    );
  };

  return (
    <>
      <Popconfirm
        destroyTooltipOnHide
        title="Delete this book"
        description="Are you sure to delete this book?"
        placement="topRight"
        okType="danger"
        okText="Delete"
        onConfirm={handleDeleteBook}
      >
        <Button size="small" type="default" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </>
  );
};
