import { CurrentAccountContext } from "@/providers/current-account-provider";
import { useContext } from "react";

export const useCurrentAccount = () => {
  const context = useContext(CurrentAccountContext);
  if (context === undefined) {
    throw new Error("useCurrentAccount must be used with CurrentAccountProvider");
  }
  return context;
};
