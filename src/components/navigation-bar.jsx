import { Link, useLocation } from "react-router-dom";
import { Flex, Menu } from "antd";
import { routeUser, routeAdmin } from "@/configs/route.config";
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
  icon: <route.Icon />,
}));

const userItem = Object.values(routeUser).map((route) => ({
  label: <Link to={route.pathname}>{route.label}</Link>,
  key: route.pathname,
  icon: <route.Icon />,
}));

export const NavigationBar = () => {
  const { currentAccount } = useCurrentAccount();
  const location = useLocation();

  if (!currentAccount) return;

  return (
    <Flex vertical className="h-full" style={{ padding: "12px 12px 24px" }}>
      <Flex vertical justify="space-between" className="h-full">
        <Menu
          selectedKeys={[location.pathname]}
          items={currentAccount.role === "ADMIN" ? adminItem : userItem}
          style={{
            border: "none",
          }}
          expandIcon={"null"}
        />
      </Flex>
    </Flex>
  );
};
