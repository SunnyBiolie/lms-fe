import { AntDesignContext } from "@/providers/ant-design-provider";
import { useContext } from "react";

export const useAntDesign = () => {
  const context = useContext(AntDesignContext);
  if (context === undefined) {
    throw new Error("useAntDesign must be used with AntDesignProvider");
  }
  return context;
};
