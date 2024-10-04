import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Avatar, Badge, Layout, List, Popover, Space, Typography } from "antd";
import { createStyles } from "antd-style";
import { UserOutlined } from "@ant-design/icons";
import { Table_Account } from "@/configs/db.config";
import { routeAuth } from "@/configs/route.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { logOutService } from "@/services/auth/log-out";

const useStyles = createStyles(({ token, css }) => ({
  header: css`
    border-bottom: 1px solid #e1e1e1;
    padding: 0 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(245, 245, 245, 0.25);
    backdrop-filter: blur(8px);
  `,
  avatar: css`
    background-color: transparent;
    border: 1px solid ${token.colorSecondary};
  `,
  icon: css`
    color: ${token.colorSecondary};
  `,
}));

const { Text } = Typography;

export const Header = () => {
  const { styles, theme } = useStyles();
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
    <Layout.Header className={styles.header}>
      <Space size="middle">
        <Space size="small">
          <Text>Hello </Text>
          <Badge
            count={currentAccount[Table_Account.role]}
            color={theme.colorSecondary}
          ></Badge>
          <Text strong>{currentAccount[Table_Account.fullName]}</Text>
        </Space>
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
                    <Text
                      type="text"
                      onClick={handleLogOut}
                      className="w-full cursor-pointer link-text"
                    >
                      Log out
                    </Text>
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
