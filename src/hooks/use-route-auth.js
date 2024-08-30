import { useLocation } from "react-router-dom";
import { routeAuth } from "@/configs/route.config";

export const useRouteAuth = () => {
  const { pathname } = useLocation();

  const arrayRoutes = Object.values(routeAuth).map((route) => route.pathname);

  const inAuthRoutes = arrayRoutes.includes(pathname);

  return {
    inAuthRoutes,
  };
};
