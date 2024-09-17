import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, Input } from "antd";
import { Rule_Required } from "@/configs/rules.config";
import { changePwdService } from "@/services/accounts/change-pwd";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useAntDesign } from "@/hooks/use-ant-design";
import { routeAuth } from "@/configs/route.config";

export const FormChangePassword = () => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const [form] = Form.useForm();
  const mutationChangePwd = useMutation({ mutationFn: changePwdService });

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    mutationChangePwd.mutate(
      {
        ...values,
        accountId: currentAccount.id,
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          form.resetFields();
          window.location.href = routeAuth.logIn.pathname;
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <Form
      form={form}
      name="change-pwd"
      layout="vertical"
      disabled={loading}
      className="section w-full"
      style={{ maxWidth: 300 }}
      onFinish={handleFormSubmit}
    >
      <Form.Item name="oldPwd" label="Old password" rules={Rule_Required}>
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPwd"
        label="New password"
        dependencies={["oldPwd"]}
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("oldPwd") !== value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password cannot be the same as the old one")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Flex justify="flex-end">
        <Button loading={loading} type="primary" htmlType="submit">
          Change
        </Button>
      </Flex>
    </Form>
  );
};
