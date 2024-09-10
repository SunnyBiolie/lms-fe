import { Navigate, Outlet } from "react-router-dom";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { routeAdmin } from "@/configs/route.config";

export default function UserLayout() {
  const { currentAccount } = useCurrentAccount();

  if (currentAccount.role === "ADMIN") {
    return <Navigate to={routeAdmin.bookMangement.pathname} replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
