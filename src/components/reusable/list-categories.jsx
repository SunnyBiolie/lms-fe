import { Fragment, memo } from "react";
import { Link } from "react-router-dom";
import { Tag, Typography } from "antd";
import { createStyles } from "antd-style";
import { capitalize } from "@/lib/capitalize";
import { Table_Category } from "@/configs/db.config";

const { Text } = Typography;

const useStyles = createStyles(({ css }) => ({
  content: css`
    &:hover {
      text-decoration: underline;
    }
  `,
}));

export const ListCategories = memo(function ListCategories({
  categories,
  isLink,
  isTag,
}) {
  const { styles } = useStyles();

  const Wrapper = isLink ? Link : Text;
  const Content = isTag ? Tag : Text;

  return (
    <>
      {categories.map((cate, index) => {
        return (
          <Fragment key={index}>
            <Wrapper to={`/search?categories=${cate[Table_Category.id]}`}>
              <Content className={!isTag && isLink && styles.content}>
                {capitalize(cate[Table_Category.name])}
              </Content>
            </Wrapper>
            {!isTag && index < categories.length - 1 && `, `}
          </Fragment>
        );
      })}
    </>
  );
});
