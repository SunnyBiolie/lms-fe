import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Flex, Spin } from "antd";
import { routeAuth } from "@/configs/route.config";
import { accessTokenService } from "@/services/auth/access-token";
import { useRouteAuth } from "@/hooks/use-route-auth";

export const CurrentAccountContext = createContext();

export default function CurrentAccountProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState();
  const navigate = useNavigate();

  const { inAuthRoutes } = useRouteAuth();

  const mutationAccessToken = useMutation({
    mutationFn: accessTokenService,
  });

  useEffect(() => {
    mutationAccessToken.mutateAsync().then((axiosResponse) => {
      if (axiosResponse.data.currentAccount) {
        setCurrentAccount(axiosResponse.data.currentAccount);
      } else {
        setCurrentAccount(null);
        if (axiosResponse.data.redirectToAuth && !inAuthRoutes) {
          navigate(routeAuth.logIn);
        }
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    currentAccount,
    setCurrentAccount,
  };

  if (currentAccount === undefined) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ width: "100vw", height: "100vh", backgroundColor: "#121314" }}
      >
        <Spin />
      </Flex>
    );
  }

  return (
    <CurrentAccountContext.Provider value={contextValue}>
      {children}
    </CurrentAccountContext.Provider>
  );
}
