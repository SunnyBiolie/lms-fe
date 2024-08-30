import { Navigate, Outlet } from "react-router-dom";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { routePrivate } from "@/configs/route.config";

export default function AdminLayout() {
  const { currentAccount } = useCurrentAccount();

  if (currentAccount.role !== "ADMIN") {
    return <Navigate to={routePrivate.dashboard.pathname} replace />
  }

  return (
    <>
      <Outlet />
    </>
  );
}
