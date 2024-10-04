import { createContext, useCallback } from "react";
import { ConfigProvider, message } from "antd";

export const AntDesignContext = createContext();

const colorPrimary = "#15B392";
const colorSecondary = "#72BF78"; // "#54C392"

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
        // algorithm: theme.defaultAlgorithm,
        token: {
          colorBgLayout: "#f5f5f5",
          colorPrimary: colorPrimary,
          colorSecondary: colorSecondary,
          colorMyHighlight: "#019879",
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
          Table: {
            headerBg: colorPrimary,
            headerColor: "#fff",
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
