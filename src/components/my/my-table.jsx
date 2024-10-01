import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  table: css`
    width: 100%;
    border-radius: 8px 8px 0 0;
    border-bottom: 2px solid #019879;
    overflow: hidden;
  `,
  header: css`
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    background-color: #019879;
  `,
  content: css`
    background-color: #fff;
  `,
  item: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-transform: capitalize;
    &:hover {
      background-color: #f1f1f1;
    }
    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  `,
  oddItem: css`
    color: #111;
  `,
  evenItem: css`
    color: #019879;
    font-weight: 500;
  `,
  cell: css`
    padding: 16px;
  `,
}));

export const MyTable = ({ data, items }) => {
  const { styles, cx } = useStyles();

  if (!data) return;

  return (
    <div className={cx(styles.table)}>
      <div className={cx(styles.header)}>
        {items.map((item, index) => (
          <span key={index} className={cx(styles.cell, "w-full")}>
            {item.title}
          </span>
        ))}
      </div>
      <div className={cx(styles.content)}>
        {data.map((d, index) => (
          <div
            key={index}
            className={cx(
              (index + 1) % 2 === 1 ? styles.oddItem : styles.evenItem,
              styles.item
            )}
          >
            {items.map((item, id) => (
              <span key={id} className={cx(styles.cell, "w-full")}>
                {d[item.dataIndex]}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
