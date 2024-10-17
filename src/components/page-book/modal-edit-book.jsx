import { Form, Modal } from "antd";
import { Table_Book, Table_Category } from "@/configs/db.config";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { editBookService } from "@/services/books/edit";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { FormBook } from "../reusable/form-book";
import { useEffect } from "react";

export const ModalEditBook = ({ book, open, onClose, refetch }) => {
  const { msgApi } = useAntDesign();

  const [form] = Form.useForm();
  const mutationEditBook = useMutation({ mutationFn: editBookService });

  useEffect(() => {
    if (book && open) {
      // Format for form's initialValues
      const options = book[Table_Book.Categories].map(
        (cate) => cate[Table_Category.id]
      );

      // Format for form's initialValues
      const publicationYear = dayjs(book[Table_Book.publicationDate]);

      // Format for form's initialValues
      const specicalBook = book[Table_Book.isSpecial] ? 1 : 0;

      form.setFieldsValue({
        ...book,
        [Table_Book.Categories]: options,
        [Table_Book.publicationDate]: publicationYear,
        [Table_Book.isSpecial]: specicalBook,
      });
    }
  }, [book, open, form]);

  const handleCancelModal = () => {
    form.resetFields();
    onClose();
  };

  const submitForm = () => {
    form.submit();
  };

  const handleFinishForm = (values) => {
    const reqData = {
      ...values,
      [Table_Book.id]: book[Table_Book.id],
    };

    form.setFieldsValue(values);

    mutationEditBook.mutate(reqData, {
      onSuccess: (res) => {
        msgApi("success", res.data.message);
        refetch();
        onClose();
      },
      onError: (err) => {
        msgApi("error", err.response.data.message);
        checkToLogOut(err);
      },
    });
  };

  return (
    <Modal
      destroyOnClose
      open={open}
      title={"Edit book"}
      onCancel={handleCancelModal}
      width={660}
      onOk={submitForm}
      okText="Save changes"
      okButtonProps={{
        loading: mutationEditBook.isPending,
      }}
    >
      <FormBook
        name="form-edit-book"
        form={form}
        onFinish={handleFinishForm}
        disabled={mutationEditBook.isPending}
      />
    </Modal>
  );
};
