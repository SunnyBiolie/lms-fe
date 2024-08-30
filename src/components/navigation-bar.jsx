import { Link, useLocation } from "react-router-dom";
import { Button, Flex, Menu } from "antd";
import {
  routeAuth,
  routePrivate,
  routeProtected,
} from "@/configs/route.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { LogoutOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { logOutService } from "@/services/auth/log-out";

// const allItem = Object.values(routePrivate)
//   .concat(Object.values(routeProtected))
//   .map((route) => ({
//     label: <Link to={route.pathname}>{route.label}</Link>,
//     key: route.pathname,
//   }));

const adminItem = Object.values(routeProtected).map((route) => ({
  label: <Link to={route.pathname}>{route.label}</Link>,
  key: route.pathname,
}));

const userItem = Object.values(routePrivate).map((route) => ({
  label: <Link to={route.pathname}>{route.label}</Link>,
  key: route.pathname,
}));

export const NavigationBar = () => {
  const { currentAccount } = useCurrentAccount();
  const location = useLocation();

  const mutationLogOut = useMutation({
    mutationFn: logOutService,
    onSuccess: () => {
      window.location.href = routeAuth.logIn.pathname;
    },
  });

  if (!currentAccount) return;

  const handleLogOut = () => {
    mutationLogOut.mutate();
  };

  return (
    <Flex
      vertical
      justify="space-between"
      style={{ height: "100%", padding: "12px 12px 24px" }}
    >
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        items={currentAccount.role === "ADMIN" ? adminItem : userItem}
      />
      <Button
        size="large"
        type="text"
        icon={<LogoutOutlined />}
        iconPosition="end"
        onClick={handleLogOut}
      >
        Log out
      </Button>
    </Flex>
  );
};
