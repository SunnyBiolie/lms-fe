import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Space, Table, Tag, Typography } from "antd";
import { getAccountsByRoleService } from "@/services/accounts/get-by-role";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { BtnEditAccount } from "./table-manage-accounts/btn-edit-account";
import { BtnMoreAction } from "./table-manage-accounts/btn-more-action";
import { Field_Account_Role, Table_Account } from "@/configs/db.config";
import { FilterFilled } from "@ant-design/icons";

const { Text } = Typography;

export const TableManageAccounts = () => {
  const { msgApi } = useAntDesign();
  const [listAccounts, setListAccounts] = useState();

  const mutationGetAccountsByRole = useMutation({
    mutationFn: getAccountsByRoleService,
  });

  const fetchListAccounts = () => {
    mutationGetAccountsByRole.mutate(
      {
        params: {
          role: "USER",
        },
      },
      {
        onSuccess: (res) => {
          setListAccounts(res.data.data);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  useEffect(() => {
    fetchListAccounts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Full name",
      dataIndex: Table_Account.fullName,
    },
    {
      title: "Role",
      dataIndex: Table_Account.role,
      width: 160,
      render: (value) => {
        let color;
        switch (value) {
          case Field_Account_Role.vip:
            color = "gold";
            break;
          case Field_Account_Role.member:
            color = "cyan";
            break;
          default:
            break;
        }
        return <Tag color={color}>{value}</Tag>;
      },
      filters: [
        {
          value: Field_Account_Role.user,
          text: Field_Account_Role.user,
        },
        {
          value: Field_Account_Role.member,
          text: Field_Account_Role.member,
        },
        {
          value: Field_Account_Role.vip,
          text: Field_Account_Role.vip,
        },
      ],
      onFilter: (value, record) => record.role === value,
      filterIcon: (filtered) => {
        return <FilterFilled style={{ color: filtered ? "#fff" : "#aaa" }} />;
      },
    },
    {
      title: "User name",
      dataIndex: Table_Account.userName,
    },
    {
      title: "Email",
      dataIndex: Table_Account.email,
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <Space>
            <BtnEditAccount
              account={record}
              fetchListAccounts={fetchListAccounts}
            />
            <BtnMoreAction
              account={record}
              fetchListAccounts={fetchListAccounts}
            />
          </Space>
        );
      },
      fixed: "right",
      width: 160,
      align: "center",
    },
  ];

  return (
    <div className="section">
      <Table
        dataSource={listAccounts}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          position: ["bottomCenter"],
          hideOnSinglePage: true,
        }}
        scroll={{
          x: 1000,
        }}
        loading={mutationGetAccountsByRole.isPending}
        title={() => <Text strong>Table of all accounts</Text>}
      />
    </div>
  );
};
