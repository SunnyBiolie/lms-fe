import { createContext, useCallback } from "react";
import { ConfigProvider, theme, message } from "antd";

export const AntDesignContext = createContext();

export default function AntDesignProvider({ children }) {
  const [globalMessageApi, contextHolder] = message.useMessage();

  const msgApi = useCallback(
    (type, content) => {
      globalMessageApi[type]({
        type,
        content,
      });
    },
    [globalMessageApi]
  );

  const value = {
    msgApi,
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#fb3453",
        },
        components: {
          Menu: {
            darkItemBg: "transparent",
            darkItemSelectedBg: "#fb3453",
            darkItemHoverBg: "#3b3b3b",
            colorBorder: "transparent",
          },
          Layout: {
            siderBg: "transparent",
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
