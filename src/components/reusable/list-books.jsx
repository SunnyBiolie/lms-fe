import { Flex, Typography } from "antd";
import { createStyles } from "antd-style";

const { Title } = Typography;

const useStyles = createStyles(({ css }) => ({
  title: css`
    margin: 8px 0 20px !important;
  `,
  card: css`
    padding: 16px;
    border: 1px solid #ccc;
  `,
}));

export const ListBooks = ({ title, books }) => {
  const { styles, cx } = useStyles();

  console.log(books);

  return (
    <Flex vertical className="section">
      <Title level={5} className={cx(styles.title)}>
        {title}
      </Title>
      <Flex>
        <div className={cx(styles.card)}>a</div>
      </Flex>
    </Flex>
  );
};

const BookCard = () => {
  
}