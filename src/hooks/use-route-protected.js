import { useLocation } from "react-router-dom";
import { routeAdmin } from "@/configs/route.config";

export const useRouteProtected = () => {
  const { pathname } = useLocation();

  const arrayRoutes = Object.values(routeAdmin).map(
    (route) => route.pathname
  );

  const inProtectedRoutes = arrayRoutes.includes(pathname);

  return {
    inProtectedRoutes,
  };
};
