import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Skeleton, Table } from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Table_Account, Table_Transaction } from "@/configs/db.config";
import { getAccountsByListIdsService } from "@/services/accounts/get-by-list-id";

export const TabBorrowing = ({ isLoading, transaction }) => {
  const mutationGetAccounts = useMutation({
    mutationFn: getAccountsByListIdsService,
  });

  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (!transaction) return;

    mutationGetAccounts.mutate(
      {
        accountIds,
      },
      {
        onSuccess: (axiosResponse) => {
          const listAccounts = axiosResponse.data.listAccounts;
          const tableData = transaction.map((t) => {
            const index = listAccounts.findIndex(
              (acc) => acc.id === t.accountId
            );
            return {
              userName: listAccounts[index].userName,
              ...t,
            };
          });

          setTableData(tableData);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  if (!transaction) return <Skeleton active />;

  const accountIds = transaction.map((tr) => tr.accountId);

  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={tableData}
        columns={[
          {
            title: "Username",
            dataIndex: Table_Account.userName,
          },
          {
            title: "Borrowed at",
            dataIndex: Table_Transaction.borrowedAt,
            width: 250,
            render: (value) => {
              dayjs.extend(localizedFormat);
              return dayjs(value[value.length - 1]).format("llll");
            },
          },
          {
            title: "Return before",
            dataIndex: Table_Transaction.dueDate,
            width: 250,
            render: (value) => {
              dayjs.extend(localizedFormat);
              return dayjs(value[value.length - 1]).format("llll");
            },
          },
        ]}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"],
          hideOnSinglePage: true,
        }}
        rowKey={(record) => record[Table_Account.userName]}
        size="small"
      ></Table>
    </div>
  );
};
