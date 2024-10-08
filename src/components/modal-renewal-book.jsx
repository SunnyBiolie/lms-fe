import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Modal } from "antd";
import { useAntDesign } from "@/hooks/use-ant-design";
import { getRenewalsByTransactionIdService } from "@/services/renewals/get-by-transaction-id";
import { Table_Account, Table_Transaction } from "@/configs/db.config";
import { createRenewalService } from "@/services/renewals/create";
import { useCurrentAccount } from "@/hooks/use-current-account";
import {
  bookRenewDaysForMember,
  bookRenewDaysForUser,
  bookRenewDaysForVip,
} from "@/configs/membership.config";

export const ModalRenewalBook = ({
  isModalOpen,
  onCloseModal,
  borrowingRecord,
  loadListBorrowing,
}) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const [form] = Form.useForm();
  const mutationGetRenewalByTransactionId = useMutation({
    mutationFn: getRenewalsByTransactionIdService,
  });
  const mutationCreateRenewal = useMutation({
    mutationFn: createRenewalService,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [renewals, setRenewals] = useState();

  const handleLoadRenewals = () => {
    mutationGetRenewalByTransactionId.mutate(
      {
        params: {
          transactionId: borrowingRecord.id,
        },
      },
      {
        onSuccess: (res) => {
          setRenewals(res.data.data);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    handleLoadRenewals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowingRecord]);

  if (!renewals) return;

  const handleCancel = () => {
    onCloseModal();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFormSubmit = (values) => {
    setIsLoading(true);
    mutationCreateRenewal.mutate(
      {
        transactionId: borrowingRecord.id,
        dueDate: values.dueDate,
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          loadListBorrowing();
          handleLoadRenewals();
          handleCancel();
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setIsLoading(false),
      }
    );
  };

  const minDate = dayjs(
    renewals.length !== 0
      ? renewals[0].dueDate
      : borrowingRecord[Table_Transaction.dueDate]
  );

  const maxDateOfBorrow =
    currentAccount[Table_Account.role] === "USER"
      ? bookRenewDaysForUser
      : currentAccount[Table_Account.role] === "MEMBER"
      ? bookRenewDaysForMember
      : currentAccount[Table_Account.role] === "VIP"
      ? bookRenewDaysForVip
      : 3;

  return (
    <Modal
      destroyOnClose
      open={isModalOpen}
      title="Renewal book"
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Form
        clearOnDestroy
        disabled={isLoading}
        form={form}
        name="form_renewal-book"
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="dueDate"
          label="Renewal date"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={dayjs(Date.now() + 86400000 * maxDateOfBorrow)}
          tooltip={`The limit starts from the last due date and extends to ${maxDateOfBorrow} days from today`}
        >
          <DatePicker
            minDate={minDate}
            maxDate={dayjs(Date.now() + 86400000 * maxDateOfBorrow)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
