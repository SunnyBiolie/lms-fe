import { useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import { Table_Account } from "@/configs/db.config";
import {
  maxAddressLength,
  maxFullNameLength,
  minAddressLength,
  minFullNameLength,
  Rule_email,
  Rule_phoneNumber,
  ruleMaxLength,
  ruleMinLength,
  ruleNotBlank,
  ruleRequired,
} from "@/configs/rules.config";
import { editAccountInforService } from "@/services/accounts/edit-infor";
import { useAntDesign } from "@/hooks/use-ant-design";

const { Text } = Typography;

export const FormChangeProfileInfo = ({ account, onAfterSaveChange, type }) => {
  const { msgApi } = useAntDesign();
  const [form] = Form.useForm();
  const mutationEditAccountInfor = useMutation({
    mutationFn: editAccountInforService,
  });

  const [editing, setEditing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const startEdit = () => {
    setEditing(true);
  };

  const stopEdit = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleValuesChange = (_, values) => {
    for (const key of Object.keys(values)) {
      if (key === Table_Account.birthDate) {
        if (
          dayjs(form.getFieldValue(key)).format() !==
          dayjs(account[key]).format()
        ) {
          return setDisabled(false);
        }
      } else {
        if (form.getFieldValue(key) !== account[key]) {
          return setDisabled(false);
        }
      }
    }
    return setDisabled(true);
  };

  const submitForm = () => {
    form.submit();
  };

  const handleFormSubmit = (values) => {
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
      }
    );
  };

  const title = type === "owner" ? "Public Profile" : "";
  const size = type === "owner" ? "middle" : "small";
  const layout = type === "owner" ? "horizontal" : "vertical";
  const columns =
    type === "owner"
      ? { xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4 }
      : { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 };

  return (
    <Flex vertical gap={28} justify="center" align="flex-end">
      <Form
        form={form}
        layout="inline"
        variant="borderless"
        size="small"
        initialValues={{
          ...account,
          [Table_Account.birthDate]: dayjs(account[Table_Account.birthDate]),
        }}
        className="w-full"
        disabled={!editing || mutationEditAccountInfor.isPending}
        onFinish={handleFormSubmit}
        onValuesChange={handleValuesChange}
      >
        <Descriptions
          title={title}
          size={size}
          layout={layout}
          bordered
          style={{ flexGrow: 1 }}
          column={columns}
          items={[
            {
              key: Table_Account.userName,
              label: <Text className="no-wrap">User name</Text>,
              children: (
                <Text
                  style={{
                    padding: "0 7px",
                    textWrap: "nowrap",
                    cursor: "default",
                  }}
                  disabled
                >
                  {account[Table_Account.userName]}
                </Text>
              ),
              span: {
                md: 1,
                xl: 1,
                xxl: 1,
              },
            },
            {
              key: Table_Account.role,
              label: <Text className="no-wrap">Role</Text>,
              children: (
                <Text
                  style={{
                    padding: "0 7px",
                    textWrap: "nowrap",
                    cursor: "default",
                  }}
                  disabled
                >
                  {account[Table_Account.role]}
                </Text>
              ),
              span: {
                md: 1,
                xl: 1,
                xxl: 1,
              },
            },
            {
              key: Table_Account.fullName,
              label: <Text className="no-wrap">Full name</Text>,
              children: (
                <Form.Item
                  name={Table_Account.fullName}
                  rules={[
                    ruleRequired(),
                    ruleNotBlank(),
                    ruleMinLength(minFullNameLength),
                    ruleMaxLength(maxFullNameLength),
                  ]}
                >
                  <Input />
                </Form.Item>
              ),

              span: {
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              },
            },
            {
              key: Table_Account.address,
              label: <Text className="no-wrap">Address</Text>,
              children: (
                <Form.Item
                  name={Table_Account.address}
                  rules={[
                    ruleRequired(),
                    ruleNotBlank(),
                    ruleMinLength(minAddressLength),
                    ruleMaxLength(maxAddressLength),
                  ]}
                >
                  <Input />
                </Form.Item>
              ),
              span: {
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              },
            },
            {
              key: Table_Account.phoneNumber,
              label: <Text className="no-wrap">Phone number</Text>,
              children: (
                <Form.Item
                  name={Table_Account.phoneNumber}
                  rules={Rule_phoneNumber}
                >
                  <Input />
                </Form.Item>
              ),
              span: {
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              },
            },
            {
              key: Table_Account.email,
              label: <Text className="no-wrap">Email</Text>,
              children: (
                <Form.Item name={Table_Account.email} rules={Rule_email}>
                  <Input />
                </Form.Item>
              ),
              span: {
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              },
            },
            {
              key: Table_Account.birthDate,
              label: <Text className="no-wrap">Birthday</Text>,
              children: (
                <Form.Item name={Table_Account.birthDate}>
                  <DatePicker format={"DD/MM/YYYY"} />
                </Form.Item>
              ),
              span: {
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              },
            },
          ]}
        />
      </Form>
      {!editing ? (
        <Button onClick={startEdit}>Edit profile</Button>
      ) : (
        <Space>
          <Button
            onClick={stopEdit}
            disabled={mutationEditAccountInfor.isPending}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={submitForm}
            loading={mutationEditAccountInfor.isPending}
            disabled={disabled}
          >
            Update profile
          </Button>
        </Space>
      )}
    </Flex>
  );
};
