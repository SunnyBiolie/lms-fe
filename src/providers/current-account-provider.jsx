import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Flex, Spin, Typography } from "antd";
import { routeAuth } from "@/configs/route.config";
import { accessTokenService } from "@/services/auth/access-token";
import { useRouteAuth } from "@/hooks/use-route-auth";
import { Field_Account_Role, Table_Account } from "@/configs/db.config";

const { Title } = Typography;

export const CurrentAccountContext = createContext();

export default function CurrentAccountProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState();
  const [isAdmin, setIsAdmin] = useState();
  // const navigate = useNavigate();

  const { inAuthRoutes } = useRouteAuth();
  const mutationAccessToken = useMutation({
    mutationFn: accessTokenService,
  });

  useEffect(() => {
    mutationAccessToken
      .mutateAsync()
      .then((axiosResponse) => {
        if (axiosResponse.data.currentAccount) {
          setCurrentAccount(axiosResponse.data.currentAccount);
          setIsAdmin(
            axiosResponse.data.currentAccount[Table_Account.role] ===
              Field_Account_Role.admin
          );
        } else {
          setCurrentAccount(null);
          if (axiosResponse.data.redirectToAuth && !inAuthRoutes) {
            // navigate(routeAuth.logIn);
            window.location.href = routeAuth.logIn.pathname;
          }
        }
      })
      .catch((err) => {
        setCurrentAccount(null);
        if (err.response.data.redirectToAuth && !inAuthRoutes) {
          // navigate(routeAuth.logIn);
          window.location.href = routeAuth.logIn.pathname;
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    currentAccount,
    setCurrentAccount,
    isAdmin,
    setIsAdmin,
  };

  if (currentAccount === undefined) {
    return (
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ width: "100%", height: "100%", backgroundColor: "#F1F1F1" }}
      >
        <Spin />
        <Title level={5}>Loading...</Title>
      </Flex>
    );
  }

  return (
    <CurrentAccountContext.Provider value={contextValue}>
      {children}
    </CurrentAccountContext.Provider>
  );
}
