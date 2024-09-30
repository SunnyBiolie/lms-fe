import { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { useMutation } from "@tanstack/react-query";
import { getAccountsByRoleService } from "@/services/accounts/get-by-role";
import { useAntDesign } from "@/hooks/use-ant-design";
import { BtnEditAccount } from "./table-manage-accounts/btn-edit-account";
import { BtnMoreAction } from "./table-manage-accounts/btn-more-action";

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
        },
      }
    );
  };

  useEffect(() => {
    fetchListAccounts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!listAccounts) return;

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 160,
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
    },
  ];

  return (
    <>
      <Table
        dataSource={listAccounts}
        columns={columns}
        rowKey={(item) => item.id}
        scroll={{
          x: 1000,
        }}
      />
    </>
  );
};
