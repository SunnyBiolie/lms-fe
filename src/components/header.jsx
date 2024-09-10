import { Table_Account } from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Layout, List, Popover, Space } from "antd";
import { createStyles } from "antd-style";
import { useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  header: css`
    background-color: transparent;
    // border-bottom: 1px solid #636363;
    padding: 0 16px;
    text-align: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #000;
  `,
  avatar: css`
    background-color: var(--primary);
  `,
}));

export const Header = () => {
  const { styles } = useStyles();

  const { currentAccount } = useCurrentAccount();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentAccount) return;

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  return (
    <Layout.Header className={styles.header}>
      <Space size="middle">
        <span>Hello, {currentAccount[Table_Account.fullName]}</span>
        <Popover
          destroyTooltipOnHide
          trigger="click"
          open={isOpen}
          placement="bottomRight"
          onOpenChange={handleOpenChange}
          content={
            <List
              dataSource={[
                {
                  title: <Link to={"/profile"}>Manage account</Link>,
                },
                {
                  title: "Change password",
                },
              ]}
              renderItem={(item) => <List.Item>{item.title}</List.Item>}
            />
          }
        >
          <Avatar gap={2} className={styles.avatar}>
            <UserOutlined />
          </Avatar>
        </Popover>
      </Space>
    </Layout.Header>
  );
};
