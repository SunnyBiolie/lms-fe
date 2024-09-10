import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { routeAuth, routeUser, routeAdmin } from "@/configs/route.config";
import { logOutService } from "@/services/auth/log-out";
import { useCurrentAccount } from "@/hooks/use-current-account";

// const allItem = Object.values(routeUser)
//   .concat(Object.values(routeAdmin))
//   .map((route) => ({
//     label: <Link to={route.pathname}>{route.label}</Link>,
//     key: route.pathname,
//   }));

const adminItem = Object.values(routeAdmin).map((route) => ({
  label: <Link to={route.pathname}>{route.label}</Link>,
  key: route.pathname,
}));

const userItem = Object.values(routeUser).map((route) => ({
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
    <Flex vertical className="h-full" style={{ padding: "12px 12px 24px" }}>
      <div style={{ height: "64px" }}>Book Library</div>
      <Flex vertical justify="space-between" className="h-full">
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={currentAccount.role === "ADMIN" ? adminItem : userItem}
          style={{
            border: "none",
          }}
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
    </Flex>
  );
};
