import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Flex, Spin, Table } from "antd";
import { Table_Account, Table_Transaction } from "@/configs/db.config";
import { getRequestingByBookIdService } from "@/services/transaction/get-requesting-by-book-id";
import { ModalPassBook } from "./modal-pass-book";

export const TableRequesting = ({ borrowingRecord, disabled }) => {
  const mutationGetRequestingByBookId = useMutation({
    mutationFn: getRequestingByBookIdService,
  });

  const [listRequesting, setListRequesting] = useState();

  useEffect(() => {
    mutationGetRequestingByBookId.mutate(
      {
        params: {
          [Table_Transaction.bookId]: borrowingRecord[Table_Transaction.bookId],
        },
      },
      {
        onSuccess: (res) => {
          setListRequesting(res.data.data);
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (disabled) return "Not available now";
  if (!listRequesting)
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    );

  const columns = [
    {
      title: "User",
      dataIndex: Table_Transaction.Account,
      render: (value) => {
        return value[Table_Account.fullName];
      },
    },
    {
      title: "Acction",
      dataIndex: "id",
      render: (value, record) => {
        return (
          <ModalPassBook
            receiverTran={record}
            borrowingRecord={borrowingRecord}
          />
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={listRequesting}
      rowKey={(tran) => tran.id}
    />
  );
};
