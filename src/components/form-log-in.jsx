import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Form, Input } from "antd";
import { createStyles } from "antd-style";
import { routeAuth, routeUser, routeAdmin } from "@/configs/route.config";
import { logInService } from "@/services/auth/log-in";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { Field_Account_Role, Table_Account } from "@/configs/db.config";

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
  const { setCurrentAccount, setIsAdmin } = useCurrentAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mutationLogIn = useMutation({ mutationFn: logInService });

  const handleFieldsChange = () => {
    if (alert) setAlert(null);
  };

  const handleFinish = (values) => {
    setIsLoading(true);
    mutationLogIn.mutate(values, {
      onSuccess: (axiosResponse) => {
        msgApi("success", axiosResponse.data.message);
        setCurrentAccount(axiosResponse.data.currentAccount);
        setIsAdmin(
          axiosResponse.data.currentAccount[Table_Account.role] ===
            Field_Account_Role.admin
        );
        if (searchParams.get("redirect-from")) {
          navigate(searchParams.get("redirect-from"));
        } else {
          navigate(
            axiosResponse.data.currentAccount.role === "ADMIN"
              ? routeAdmin.bookMangement.pathname
              : routeUser.dashboard.pathname
          );
        }
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
