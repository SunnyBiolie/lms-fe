import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Empty, Flex, Skeleton } from "antd";
import { getBookByIdService } from "@/services/books/get-by-id";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { DescriptionsBookInfor } from "@/components/page-book/descriptions-infor";
import { ListBooks } from "@/components/reusable/list-books";
import { Table_Book } from "@/configs/db.config";
import { getListBooksByAuthor } from "@/services/books/get-by-author";
import { getRelativeBooksByCategories } from "@/services/books/get-relatives-by-categories";

export default function BookPage() {
  const params = useParams();

  const { isFetching, data, error, refetch } = useQuery({
    queryKey: ["bookData", params.id],
    queryFn: () =>
      getBookByIdService({
        params: {
          bookId: params.id,
        },
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isFetching)
    return (
      <Flex vertical gap={16}>
        <Skeleton
          active
          paragraph={{
            rows: 6,
          }}
          className="section"
        />
        <Skeleton
          active
          paragraph={{
            rows: 6,
          }}
          className="section"
        />
        <Skeleton
          active
          paragraph={{
            rows: 6,
          }}
          className="section"
        />
      </Flex>
    );
  if (error) return checkToLogOut(error);

  const book = data.data.data;

  if (!book) return <Empty description={"Book does not exist"} />;

  return (
    <Flex vertical gap={16}>
      <DescriptionsBookInfor book={book} refetch={refetch} />
      <SectionSameAuthor book={book} />
      <SectionRelativeBooks book={book} />
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

  if (isFetching)
    return (
      <Skeleton
        active
        paragraph={{
          rows: 6,
        }}
        className="section"
      />
    );
  if (error) return checkToLogOut(error);

  const resData = data.data.data;
  const books = resData.filter((b) => b[Table_Book.id] !== book[Table_Book.id]);

  return (
    <ListBooks title={`More from ${book[Table_Book.author]}`} books={books} />
  );
};

const SectionRelativeBooks = ({ book }) => {
  const { isFetching, data, error } = useQuery({
    queryKey: ["list-relative-books"],
    queryFn: () =>
      getRelativeBooksByCategories({
        categories: book[Table_Book.Categories],
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isFetching)
    return (
      <Skeleton
        active
        paragraph={{
          rows: 6,
        }}
        className="section"
      />
    );
  if (error) return checkToLogOut(error);

  const resData = data.data.data;
  const books = resData.filter((b) => b[Table_Book.id] !== book[Table_Book.id]);

  return <ListBooks title={`You may like`} books={books} author />;
};
