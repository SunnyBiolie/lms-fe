import { Table_Account } from "@/configs/db.config";
import {
  maxAddressLength,
  Rule_email,
  Rule_phoneNumber,
  ruleMaxLength,
  ruleMinLength,
  ruleRequired,
} from "@/configs/rules.config";
import { Button, DatePicker, Flex, Form, Input } from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    width: 352px;
    margin: 0 auto;
  `,
}));

export const FormUserInfor = ({ nextStep, userInfor, setUserInfor }) => {
  const { styles, cx } = useStyles();

  const handleFinish = (values) => {
    setUserInfor(values);
    nextStep();
  };

  return (
    <Form
      name="form-user-infor"
      layout="vertical"
      className={cx(styles.container, "form-card")}
      initialValues={userInfor}
      onFinish={handleFinish}
    >
      <Form.Item
        name={Table_Account.fullName}
        label="Full name"
        rules={[ruleRequired("full name"), ruleMinLength(), ruleMaxLength()]}
      >
        <Input placeholder="ex: John Doe" />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[
          ruleRequired("address"),
          ruleMinLength(),
          ruleMaxLength(maxAddressLength),
        ]}
      >
        <Input placeholder="ex: 123 Maple Street Anytown" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Phone number"
        rules={Rule_phoneNumber}
      >
        <Input placeholder="ex: (880) 978-0446" />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={Rule_email}>
        <Input placeholder="ex: johndoe@email.com" />
      </Form.Item>
      <Form.Item
        name="birthDate"
        label="Date of birth"
        rules={[ruleRequired("date of birth")]}
      >
        <DatePicker
          maxDate={dayjs(Date.now())}
          style={{
            width: "100%",
          }}
          format={"DD/MM/YYYY"}
          placeholder="DD/MM/YYYY"
        />
      </Form.Item>
      <Flex justify="flex-end">
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </Flex>
    </Form>
  );
};
