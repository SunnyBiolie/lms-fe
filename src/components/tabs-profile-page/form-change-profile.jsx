import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Flex, Form, Input } from "antd";
import { createStyles } from "antd-style";
import { Table_Account } from "@/configs/db.config";
import {
  Rule_email,
  Rule_phoneNumber,
  Rule_Required,
} from "@/configs/rules.config";
import { editAccountInforService } from "@/services/accounts/edit-infor";
import { useAntDesign } from "@/hooks/use-ant-design";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  form: css`
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
}));

export const FormChangeProfile = ({ account, onAfterSaveChange }) => {
  const { styles } = useStyles();
  const { msgApi } = useAntDesign();
  const [form] = Form.useForm();
  const mutationEditAccountInfor = useMutation({
    mutationFn: editAccountInforService,
  });

  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      ...account,
      [Table_Account.birthDate]: dayjs(account[Table_Account.birthDate]),
    });
  }, [account, form]);

  const handleStartEdit = () => {
    setEditing(true);
  };

  const handleStopEdit = () => {
    setEditing(false);
  };

  const handleFormSubmit = (values) => {
    setIsSaving(true);
    mutationEditAccountInfor.mutate(
      {
        ...values,
        id: account.id,
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          setEditing(false);
          onAfterSaveChange(axiosResponse);
        },
        onError: (axiosError) => {
          msgApi("success", axiosError.response.data.message);
        },
        onSettled: () => setIsSaving(false),
      }
    );
  };

  return (
    <Form
      disabled={!editing || isSaving}
      form={form}
      name="change-profile"
      layout="vertical"
      variant="filled"
      className={styles.form}
      onFinish={handleFormSubmit}
    >
      <div className={""}>
        <Form.Item
          name={Table_Account.fullName}
          label="Fullname"
          rules={Rule_Required}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={Table_Account.address}
          label="Address"
          rules={Rule_Required}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={Table_Account.phoneNumber}
          label="Phone number"
          rules={Rule_phoneNumber}
        >
          <Input />
        </Form.Item>
        <Form.Item name={Table_Account.email} label="Email" rules={Rule_email}>
          <Input />
        </Form.Item>
        <Form.Item
          name={Table_Account.birthDate}
          label="Date of birth"
          rules={Rule_Required}
        >
          <DatePicker maxDate={dayjs(Date.now())} format={"DD/MM/YYYY"} />
        </Form.Item>
      </div>
      <Flex justify="center" align="center" gap={8}>
        {editing ? (
          <>
            <Button onClick={handleStopEdit}>Cancel</Button>
            <Button type="primary" loading={isSaving} htmlType="submit">
              Save
            </Button>
          </>
        ) : (
          <Button disabled={editing} type="primary" onClick={handleStartEdit}>
            Edit
          </Button>
        )}
      </Flex>
    </Form>
  );
};
