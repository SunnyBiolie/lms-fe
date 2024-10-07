import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Skeleton, Spin } from "antd";
import { getBookByIdService } from "@/services/books/get-by-id";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { DescriptionsBookInfor } from "@/components/page-book/descriptions-infor";
import { ActionBook } from "@/components/page-book/action-book";

export default function BookPage() {
  const params = useParams();

  const { isFetching, data, error, refetch } = useQuery({
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

  if (isFetching) return <Skeleton className="section" />;
  if (error) return checkToLogOut(error);

  const book = data.data.data;

  if (!book) return <Empty description={"Book does not exist"} />;

  return (
    <Row gutter={8}>
      <Col span={24}>
        <DescriptionsBookInfor book={book} refetch={refetch} />
      </Col>
      {/* <Col span={4}>
        <ActionBook />
      </Col> */}
    </Row>
  );
}
