import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Empty, Flex, Row, Spin } from "antd";
import { getBookByIdService } from "@/services/books/get-by-id";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { DescriptionsBookInfor } from "@/components/page-book/descriptions-infor";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { Table_Account } from "@/configs/db.config";

export default function BookPage() {
  const params = useParams();
  const { currentAccount } = useCurrentAccount();

  const { isFetching, data, error } = useQuery({
    queryKey: ["bookData"],
    queryFn: () =>
      getBookByIdService({
        params: {
          bookId: params.id,
        },
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isFetching) return <Spin />;
  if (error) return checkToLogOut(error);

  const book = data.data.data;

  if (!book) return <Empty description={"Book does not exist"} />;

  const isAdmin = currentAccount[Table_Account.role] === "ADMIN";

  return (
    <Row gutter={8}>
      <Col span={20}>
        <DescriptionsBookInfor book={book} />
      </Col>
      <Col span={4}>
        <Flex className="section">
          {isAdmin ? (
            <>
              <Button>Edit</Button>
              <Button danger>Delete</Button>
            </>
          ) : (
            "not"
          )}
        </Flex>
      </Col>
    </Row>
  );
}
