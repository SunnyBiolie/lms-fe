import { useLocation } from "react-router-dom";
import { routeProtected } from "@/configs/route.config";

export const useRouteProtected = () => {
  const { pathname } = useLocation();

  const arrayRoutes = Object.values(routeProtected).map(
    (route) => route.pathname
  );

  const inProtectedRoutes = arrayRoutes.includes(pathname);

  return {
    inProtectedRoutes,
  };
};
