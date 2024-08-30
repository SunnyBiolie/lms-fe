import { rules } from "@/configs/admin.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { renewalBookService } from "@/services/transactions/renewal";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

export const ModalRenewalBook = ({
  isModalOpen,
  onCloseModal,
  transaction,
}) => {
  const { globalMessageApi } = useAntDesign();
  const [form] = Form.useForm();
  const mutationRenewalBook = useMutation({ mutationFn: renewalBookService });
  const [isLoading, setIsLoading] = useState(false);

  const renewalCount = transaction.expectedReturnAt.length - 1;

  const handleCancel = () => {
    onCloseModal();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFormSubmit = (values) => {
    setIsLoading(true);
    mutationRenewalBook.mutate(
      {
        id: transaction.id,
        newExpectedReturnAt: values.expectedReturnAt,
      },
      {
        onSuccess: (axiosResponse) => {
          globalMessageApi.success({
            type: "success",
            content: axiosResponse.data.message,
          });
        },
        onSettled: () => setIsLoading(false),
      }
    );
  };

  return (
    <Modal
      open={isModalOpen}
      title="Renewal"
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Form
        disabled={isLoading}
        form={form}
        name="renewal-book"
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="expectedReturnAt"
          label="Book renewal date"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={dayjs(Date.now() + 86400000 * rules.maxDateOfBorrow)}
        >
          <DatePicker
            minDate={dayjs(transaction.expectedReturnAt[renewalCount])}
            maxDate={dayjs(Date.now() + 86400000 * rules.maxDateOfBorrow)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
