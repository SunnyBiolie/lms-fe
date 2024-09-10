import { Rule_phoneNumber } from "@/configs/rules.config";
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
      name="user-infor"
      layout="vertical"
      className={cx(styles.container, "form-card")}
      // variant="filled"
      initialValues={userInfor}
      onFinish={handleFinish}
    >
      <Form.Item
        name="fullName"
        label="Fullname"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="ex: John Doe" />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="ex: 123 Maple Street Anytown" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Phone number"
        rules={Rule_phoneNumber}
      >
        <Input placeholder="ex: 888-579-5910" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
          },
          // {
          //   type: "email",
          //   message: "Invalid Email",
          // },
        ]}
      >
        <Input placeholder="ex: johndoe@email.com" />
      </Form.Item>
      <Form.Item
        name="birthDate"
        label="Date of birth"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker
          maxDate={dayjs(Date.now())}
          style={{
            width: "100%",
          }}
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
