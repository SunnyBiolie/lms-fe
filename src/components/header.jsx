import { Table_Account } from "@/configs/db.config";
import { routeAuth } from "@/configs/route.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { logOutService } from "@/services/auth/log-out";
import { UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  Layout,
  List,
  Popover,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
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
    background-color: #f1f1f1;
    border: 1px solid var(--primary);
  `,
  icon: css`
    color: var(--primary);
  `,
}));

export const Header = () => {
  const { styles } = useStyles();
  const { token } = theme.useToken();

  const mutationLogOut = useMutation({
    mutationFn: logOutService,
    onSuccess: () => {
      window.location.href = routeAuth.logIn.pathname;
    },
  });

  const { currentAccount } = useCurrentAccount();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentAccount) return;

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  const closePopover = () => {
    setIsOpen(false);
  };

  const handleLogOut = () => {
    mutationLogOut.mutate();
  };

  return (
    <Layout.Header
      className={styles.header}
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <Space size="middle">
        <Typography.Text strong>
          Hello, {currentAccount[Table_Account.fullName]}
        </Typography.Text>
        <Tag color="orange">{currentAccount[Table_Account.role]}</Tag>
        <Popover
          destroyTooltipOnHide
          trigger="click"
          open={isOpen}
          placement="bottomRight"
          onOpenChange={handleOpenChange}
          className="cursor-pointer"
          color="#fefefe"
          content={
            <List
              dataSource={[
                {
                  title: (
                    <Link
                      to={"/profile"}
                      onClick={closePopover}
                      className="link-text w-full cursor-pointer"
                    >
                      Manage account
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link
                      to={"/profile?tab=change-pwd"}
                      onClick={closePopover}
                      className="link-text w-full cursor-pointer"
                    >
                      Change password
                    </Link>
                  ),
                },
                {
                  title: (
                    <Typography.Text
                      type="text"
                      onClick={handleLogOut}
                      className="w-full cursor-pointer link-text"
                    >
                      Log out
                    </Typography.Text>
                  ),
                },
              ]}
              renderItem={(item) => <List.Item>{item.title}</List.Item>}
            />
          }
        >
          <Avatar gap={2} className={styles.avatar}>
            <UserOutlined className={styles.icon} />
          </Avatar>
        </Popover>
      </Space>
    </Layout.Header>
  );
};
