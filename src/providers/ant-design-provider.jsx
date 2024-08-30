import { createContext } from "react";
import { ConfigProvider, theme, message } from "antd";

export const AntDesignContext = createContext();

export default function AntDesignProvider({ children }) {
  const [globalMessageApi, contextHolder] = message.useMessage();

  const value = {
    globalMessageApi,
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#F97300",
        },
        components: {
          Menu: {
            darkItemBg: "#141414",
            darkItemSelectedBg: "#F97300",
          },
          Layout: {
            siderBg: "#141414",
          },
        },
      }}
      button={{
        style: {
          boxShadow: "none",
        },
      }}
      modal={{
        styles: {
          header: {
            paddingBottom: "8px",
            textAlign: "center",
          },
          footer: {
            paddingTop: "8px",
          },
        },
      }}
      datePicker={{
        style: {
          width: "100%",
        },
      }}
    >
      <AntDesignContext.Provider value={value}>
        {contextHolder}
        {children}
      </AntDesignContext.Provider>
    </ConfigProvider>
  );
}
