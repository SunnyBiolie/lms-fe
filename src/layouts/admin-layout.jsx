import { Navigate, Outlet } from "react-router-dom";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { routeUser } from "@/configs/route.config";

export default function AdminLayout() {
  const { currentAccount } = useCurrentAccount();

  if (currentAccount.role !== "ADMIN") {
    return <Navigate to={routeUser.dashboard.pathname} replace />
  }

  return (
    <>
      <Outlet />
    </>
  );
}
