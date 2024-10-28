import { routeAuth } from "@/configs/route.config";
import {
  maxPasswordLength,
  maxUserNameLength,
  minPasswordLength,
  minUserNameLength,
  ruleMaxLength,
  ruleMinLength,
  ruleRequired,
} from "@/configs/rules.config";
import { signUpService } from "@/services/auth/sign-up";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Flex, Form, Input, Result, Spin } from "antd";
import { createStyles } from "antd-style";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    position: relative;
    width: 352px;
    margin: 0 auto;
  `,
  loading: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
  `,
  result: css`
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 8px;
    box-shadow: 0 0 24px 4px #fafafa40;
  `,
}));

export const FormSighUp = ({ prevStep, userInfor }) => {
  const { styles, cx } = useStyles();

  const mutationSignUp = useMutation({ mutationFn: signUpService });

  const handleFieldsChange = () => {
    mutationSignUp.reset();
  };

  const handleFinish = (values) => {
    mutationSignUp.mutate({
      userInfor,
      accountValues: values,
    });
  };

  return (
    <>
      {mutationSignUp.isSuccess ? (
        <Result
          status="success"
          title="Account created successfully"
          extra={[
            <Button type="primary" key="log-in">
              <Link to={routeAuth.logIn}>Go to log in</Link>
            </Button>,
          ]}
          className={styles.result}
        />
      ) : (
        <Form
          name="form-sign-up"
          layout="vertical"
          className={cx(styles.container, "form-card")}
          onFieldsChange={handleFieldsChange}
          onFinish={handleFinish}
        >
          {mutationSignUp.isPending && (
            <Flex justify="center" align="center" className={styles.loading}>
              <Spin />
            </Flex>
          )}
          <Form.Item
            name="userName"
            label="Username"
            rules={[
              ruleRequired("user name"),
              ruleMinLength(minUserNameLength),
              ruleMaxLength(maxUserNameLength),
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="passWord"
            label="Password"
            rules={[
              ruleRequired("password"),
              ruleMinLength(minPasswordLength),
              ruleMaxLength(maxPasswordLength),
            ]}
          >
            <Input.Password />
          </Form.Item>
          {mutationSignUp.isError && (
            <Alert
              type="error"
              message={mutationSignUp.error.response.data}
              showIcon
              style={{
                marginTop: 32,
                marginBottom: 16,
              }}
            />
          )}
          <Flex align="center" justify="space-between">
            <Button onClick={prevStep}>Back</Button>
            <Button type="primary" htmlType="submit">
              Done
            </Button>
          </Flex>
        </Form>
      )}
    </>
  );
};
