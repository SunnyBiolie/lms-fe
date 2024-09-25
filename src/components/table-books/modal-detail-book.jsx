import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Flex, Modal, Tabs, Typography } from "antd";
import { getBorrowingByBookIdService } from "@/services/transaction/get-borrowing-by-book-id";
import { TabBorrowing } from "@/components/modal-detail-book/tab-borrowing";
import { TabDetail } from "@/components/modal-detail-book/tab-detail";
import { Table_Book } from "@/configs/db.config";
import { StarFilled } from "@ant-design/icons";

export const ModalDetailBook = ({ isModalOpen, setIsModalOpen, data }) => {
  const mutationGetBorrowingByBookId = useMutation({
    mutationFn: getBorrowingByBookIdService,
  });

  const [transaction, setBorrowing] = useState();
  const [isLoading, setIsLoading] = useState();

  const handleTabClick = (activeKey) => {
    if (activeKey === "transaction") {
      setIsLoading(true);
      mutationGetBorrowingByBookId.mutate(
        {
          params: {
            bookId: data.bookData.id,
          },
        },
        {
          onSuccess: (axiosResponse) => {
            setBorrowing(axiosResponse.data.listTransactions);
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
      {data && data.bookData[Table_Book.isSpecial] && (
        <Flex align="center" justify="center" gap={4}>
          <Typography.Text>This is special book</Typography.Text>
          <StarFilled style={{ color: "#fbdb14" }} />
        </Flex>
      )}
      <Tabs
        items={[
          {
            key: "detail",
            label: "Detail",
            children: <TabDetail bookData={data && data.bookData} />,
          },
          {
            key: "transaction",
            label: "Borrowing",
            children: (
              <TabBorrowing isLoading={isLoading} transaction={transaction} />
            ),
          },
        ]}
        onTabClick={handleTabClick}
      />
    </Modal>
  );
};
