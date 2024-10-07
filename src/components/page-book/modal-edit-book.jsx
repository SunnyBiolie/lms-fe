import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { Table_Book, Table_Category } from "@/configs/db.config";
import { useBooks } from "@/hooks/use-books";
import dayjs from "dayjs";
import {
  formRule_authorName,
  formRule_bookPages,
  formRule_bookPrice,
  formRule_bookQuantity,
  formRule_bookTitle,
  formRule_categories,
  formRule_publicationYear,
  formRule_publisher,
  formRule_specialBook,
  maxBookPrice,
  maxNumberOfPages,
  maxPublicationYear,
  maxQuantityOfBooks,
  minBookPrice,
  minNumberOfPages,
  minQuantityOfBooks,
} from "@/configs/rules.config";
import { useMutation } from "@tanstack/react-query";
import { editBookService } from "@/services/books/edit";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";

export const ModalEditBook = ({ book, open, onClose, refetch }) => {
  const { msgApi } = useAntDesign();
  const { listOfCategories } = useBooks();

  const [form] = Form.useForm();
  const mutationEditBook = useMutation({ mutationFn: editBookService });

  // Format for form's initialValues
  const options = book[Table_Book.Categories].map((cate) => ({
    label:
      cate[Table_Category.name].charAt(0).toUpperCase() +
      cate[Table_Category.name].slice(1),
    value: cate[Table_Category.id],
  }));

  // Format for form's initialValues
  const publicationYear = dayjs(book[Table_Book.publicationDate]);

  // Format for form's initialValues
  const specicalBook = book[Table_Book.isSpecial] ? 1 : 0;

  const initialValues = {
    ...book,
    [Table_Book.Categories]: options,
    [Table_Book.publicationDate]: publicationYear,
    [Table_Book.isSpecial]: specicalBook,
  };

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
      id: book[Table_Book.id],
    };
    mutationEditBook.mutate(reqData, {
      onSuccess: (res) => {
        msgApi("success", res.data.message);
        refetch();
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
      <Form
        form={form}
        id="form-edit-book"
        initialValues={initialValues}
        size="small"
        layout="vertical"
        onFinish={handleFinishForm}
        disabled={mutationEditBook.isPending}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name={Table_Book.title}
              label="Title"
              rules={formRule_bookTitle}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={Table_Book.author}
              label="Author"
              rules={formRule_authorName}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name={Table_Book.publisher}
              label="Publisher"
              rules={formRule_publisher}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={Table_Book.Categories}
              label="Categories"
              rules={formRule_categories}
            >
              <Select mode="multiple" options={listOfCategories} maxCount={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name={Table_Book.publicationDate}
              label="Publication year"
              rules={formRule_publicationYear}
            >
              <DatePicker picker="year" maxDate={maxPublicationYear} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={Table_Book.pages}
              label="Pages"
              rules={formRule_bookPages}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                min={minNumberOfPages}
                max={maxNumberOfPages}
                formatter={(value) =>
                  `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name={Table_Book.price}
              label="Price"
              rules={formRule_bookPrice}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                min={minBookPrice}
                max={maxBookPrice}
                step={1000}
                formatter={(value) =>
                  `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} \u20ab`
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={Table_Book.quantity}
              label="Total quantity"
              rules={formRule_bookQuantity}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                min={minQuantityOfBooks}
                max={maxQuantityOfBooks}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name={Table_Book.isSpecial}
              label="Special book"
              rules={formRule_specialBook}
            >
              <Select
                options={[
                  {
                    label: "No",
                    value: 0,
                  },
                  {
                    label: "Yes",
                    value: 1,
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
