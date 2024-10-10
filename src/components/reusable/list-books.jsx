import { noImage } from "@/assets/no-imge";
import { Table_Book } from "@/configs/db.config";
import { Flex, Image, Tag, Typography } from "antd";
import { createStyles } from "antd-style";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const useStyles = createStyles(({ token, css }) => ({
  title: css`
    font-size: 16px;
    margin: 8px 0 20px !important;
  `,
  card: css`
    width: 232px;
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    &:hover {
      border: 1px solid ${token.colorSecondary};
      box-shadow: 4px 4px 0px 0px ${token.colorSecondary};
    }
    transition: all 0.1s linear;
  `,
}));

export const ListBooks = ({ title, books, author }) => {
  const { styles, cx } = useStyles();

  if (!books || books.length === 0) return;

  return (
    <Flex vertical className="section">
      <Title level={5} className={cx(styles.title)}>
        {title}
      </Title>
      <Flex gap={16}>
        {books.map((book, index) => (
          <BookCard key={index} book={book} author={author} />
        ))}
      </Flex>
    </Flex>
  );
};

const BookCard = ({ book, author }) => {
  const { styles, cx } = useStyles();

  return (
    <Flex vertical gap={12} className={cx(styles.card)}>
      <Image
        src={`${book[Table_Book.imageLink]}?tr=ar-4-5,w-200`}
        preview={{
          destroyOnClose: true,
          src: book[Table_Book.imageLink],
        }}
        fallback={noImage}
      />
      <Link to={`/book/${book[Table_Book.id]}`}>
        <Text strong>{book[Table_Book.title]}</Text>
      </Link>
      {author && <Text italic>by {book[Table_Book.author]}</Text>}
      <Text>
        {book[Table_Book.Categories].map((cate, index) => (
          <Tag key={index} className="capitalize">
            {cate.name}
          </Tag>
        ))}
      </Text>
    </Flex>
  );
};
