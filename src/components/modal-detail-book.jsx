import { getAccountsByListIdsService } from "@/services/accounts/get-by-list-id";
import { getTransactionsByBookIdService } from "@/services/transactions/get-by-book-id";
import { useMutation } from "@tanstack/react-query";
import { Col, Modal, Row, Table, Tabs, Tag } from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { useEffect, useState } from "react";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  row: css`
    padding: 12px 0;
    margin: 0 8px !important;
    &:not(:last-child) {
      border-bottom: 1px solid #333;
    }
  `,
  key: css`
    font-weight: 500;
  `,
}));

export const ModalDetailBook = ({ isModalOpen, setIsModalOpen, data }) => {
  const mutationGetTransactionsByBookId = useMutation({
    mutationFn: getTransactionsByBookIdService,
  });

  const [transactions, setTransactions] = useState();
  const [isLoading, setIsLoading] = useState();

  const handleTabClick = (activeKey) => {
    if (activeKey === "borrowing") {
      setIsLoading(true);
      mutationGetTransactionsByBookId.mutate(
        {
          params: {
            bookId: data.bookData.id,
          },
        },
        {
          onSuccess: (axiosResponse) => {
            setTransactions(axiosResponse.data.listTransactions);
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      loading={data === undefined}
      destroyOnClose
      open={isModalOpen}
      title={"Detail of book"}
      // eslint-disable-next-line no-unused-vars
      footer={(_, { __, CancelBtn }) => (
        <>
          <CancelBtn />
        </>
      )}
      cancelText="Close"
      onCancel={handleCancel}
    >
      <Tabs
        items={[
          {
            key: "detail",
            label: "Detail",
            children: <DetailTab bookData={data && data.bookData} />,
          },
          {
            key: "borrowing",
            label: "Borrowing",
            children: (
              <BorrowingTab isLoading={isLoading} transactions={transactions} />
            ),
          },
        ]}
        onTabClick={handleTabClick}
      />
    </Modal>
  );
};

const DetailTab = ({ bookData }) => {
  const { styles } = useStyles();

  if (!bookData) return;

  const convertDataForTable = (bookData) => {
    return {
      ["Name"]: bookData.name,
      ["Author"]: bookData.author,
      ["Publisher"]: bookData.publisher,
      ["Categories"]: bookData.categories,
      ["Year Of Publication"]: bookData.yearOfPublication,
      ["All Quantity"]: bookData.allQuantity,
    };
  };

  const keys = Object.keys(convertDataForTable(bookData));
  const values = Object.values(convertDataForTable(bookData));

  return (
    <>
      {keys.map((key, index) => (
        <Row key={key} className={styles.row} gutter={16}>
          <Col span={8} className={styles.key}>
            {key}:
          </Col>
          <Col span={16}>
            {key === "Categories"
              ? values[index].map((c) => (
                  <Tag
                    key={c.id}
                    color={"#3b3b3b"}
                    style={{ textTransform: "capitalize" }}
                  >
                    {c.name}
                  </Tag>
                ))
              : key === "Year Of Publication"
              ? dayjs(values[index]).format("YYYY-MM-DD")
              : values[index]}
          </Col>
        </Row>
      ))}
    </>
  );
};

const BorrowingTab = ({ isLoading, transactions }) => {
  const mutationGetAccounts = useMutation({
    mutationFn: getAccountsByListIdsService,
  });

  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (!transactions) return;

    mutationGetAccounts.mutate(
      {
        accountIds,
      },
      {
        onSuccess: (axiosResponse) => {
          const listAccounts = axiosResponse.data.listAccounts;
          const tableData = transactions.map((t) => {
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
  }, [transactions]);

  if (!transactions) return;

  const accountIds = transactions.map((tr) => tr.accountId);

  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={tableData}
        columns={[
          {
            title: "Username",
            dataIndex: "userName",
          },
          {
            title: "Borrowed at",
            dataIndex: "borrowedAt",
            width: 250,
            render: (values) => {
              dayjs.extend(localizedFormat);
              return dayjs(values).format("llll");
            },
          },
          {
            title: "Return before",
            dataIndex: "expectedReturnAt",
            width: 250,
            render: (values) => {
              dayjs.extend(localizedFormat);
              return dayjs(values[values.length - 1]).format("llll");
            },
          },
        ]}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"],
          hideOnSinglePage: true,
        }}
        rowKey={(record) => record.userName}
        size="small"
      ></Table>
    </div>
  );
};
