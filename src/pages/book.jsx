import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Empty, Flex, Skeleton } from "antd";
import { getBookByIdService } from "@/services/books/get-by-id";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { DescriptionsBookInfor } from "@/components/page-book/descriptions-infor";
import { ListBooks } from "@/components/reusable/list-books";
import { Table_Book } from "@/configs/db.config";
import { getListBooksByAuthor } from "@/services/books/get-by-author";

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
    <Flex vertical gap={16}>
      <DescriptionsBookInfor book={book} refetch={refetch} />
      <SectionSameAuthor book={book} />
    </Flex>
  );
}

const SectionSameAuthor = ({ book }) => {
  const { isFetching, data, error } = useQuery({
    queryKey: ["list-books-same-author"],
    queryFn: () =>
      getListBooksByAuthor({
        params: {
          author: book[Table_Book.author],
        },
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isFetching) return <Skeleton className="section" />;
  if (error) return checkToLogOut(error);

  const books = data.data.data;

  return <ListBooks title={"Same author"} books={books} />;
};
