import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Form, Input } from "antd";
import { createStyles } from "antd-style";
import {
  routeAuth,
  routeUser,
  routeAdmin,
} from "@/configs/route.config";
import { logInService } from "@/services/auth/log-in";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useCurrentAccount } from "@/hooks/use-current-account";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    width: 352px;
    margin: 0 auto;
  `,
  footer: css`
    text-align: center;
    padding-top: 24px;
    padding-bottom: 16px;
    & > a {
      &:hover {
        text-decoration: underline;
      }
    }
  `,
}));

export const FormLogIn = () => {
  const { styles, cx } = useStyles();

  const { msgApi } = useAntDesign();
  const { setCurrentAccount } = useCurrentAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState();
  const navigate = useNavigate();

  const mutationLogIn = useMutation({ mutationFn: logInService });

  const handleFieldsChange = () => {
    if (alert) setAlert(null);
  };

  const handleFinish = (values) => {
    setIsLoading(true);
    mutationLogIn.mutate(values, {
      onSuccess: (axiosResponse) => {
        msgApi("success", axiosResponse.data.message);
        setCurrentAccount(axiosResponse.data.accountInfo);
        navigate(
          axiosResponse.data.accountInfo.role === "ADMIN"
            ? routeAdmin.bookMangement.pathname
            : routeUser.dashboard.pathname
        );
      },
      onError: (error) => {
        setAlert({
          type: "error",
          message: error.response.data.message,
        });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Form
      name="form-log-in"
      layout="vertical"
      className={cx(styles.container, "form-card")}
      onFieldsChange={handleFieldsChange}
      onFinish={handleFinish}
      disabled={isLoading}
    >
      <Form.Item
        name="userName"
        label="Username"
        rules={[
          {
            required: true,
            message: "Please enter username",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="passWord"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please enter password",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {alert && (
        <Alert
          showIcon
          type={alert.type}
          message={alert.message}
          style={{ marginBottom: "24px" }}
        />
      )}
      <Button
        loading={isLoading}
        type="primary"
        htmlType="submit"
        style={{ width: "100%", marginTop: "8px" }}
      >
        Log in
      </Button>
      <div className={styles.footer}>
        Don&apos;t have an account yet? Sign up{" "}
        <Link to={routeAuth.signUp.pathname}>now</Link>
      </div>
    </Form>
  );
};
