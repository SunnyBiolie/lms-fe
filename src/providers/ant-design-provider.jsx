import { createContext, useCallback, useState } from "react";
import { ConfigProvider, theme, message } from "antd";

export const AntDesignContext = createContext();

export default function AntDesignProvider({ children }) {
  const [globalMessageApi, contextHolder] = message.useMessage();
  const [currentTheme, setCurrentTheme] = useState("light");

  const msgApi = useCallback(
    (type, content) => {
      globalMessageApi[type]({
        type,
        content,
      });
    },
    [globalMessageApi]
  );

  const lightTheme = {};

  const value = {
    msgApi,
  };

  return (
    <ConfigProvider
      theme={{
        // algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#fb3453",
          colorBgLayout: "#f5f5f5",
        },
        components: {
          Menu: {
            itemBg: "transparent",
            // darkItemSelectedBg: "#fb3453",
            // darkItemHoverBg: "#3b3b3b",
            // colorBorder: "transparent",
          },
          Layout: {
            siderBg: "transparent",
            triggerBg: "transparent",
            triggerColor: "#111",
          },
          Steps: {
            colorText: "rgba(255, 255, 255, 0.88)",
            colorTextDescription: "rgba(255, 255, 255, 0.45)",
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
