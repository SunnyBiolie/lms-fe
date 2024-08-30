import { Outlet } from "react-router-dom";
import CurrentAccountProvider from "@/providers/current-account-provider";
import AntDesignProvider from "@/providers/ant-design-provider";

export default function AppLayout() {
  return (
    <AntDesignProvider>
      <CurrentAccountProvider>
        <Outlet />
      </CurrentAccountProvider>
    </AntDesignProvider>
  );
}
