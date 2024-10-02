import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { createStyles } from "antd-style";
import TransactionsProvider from "@/providers/transactions-provider";
import BooksProvider from "@/providers/books-provider";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useRouteProtected } from "@/hooks/use-route-protected";
import { NavigationBar } from "@/components/navigation-bar";
import { Header } from "@/components/header";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  layout: css`
    width: 100%;
    min-height: 100%;
  `,
  body: css`
    margin-top: var(--header-height);
  `,
  content: css`
    padding: 16px;
    margin: 16px;
    margin-bottom: 20px;
    background-color: #eee;
    // border-radius: 8px 8px 0 0;
    border-radius: 8px;
  `,
}));

const { Sider, Content } = Layout;

export default function WithNavBarLayout() {
  const { styles } = useStyles();

  const { currentAccount } = useCurrentAccount();
  const { inProtectedRoutes } = useRouteProtected();

  const [collapsed, setCollapsed] = useState(false);

  if (!currentAccount) return;

  if (inProtectedRoutes && currentAccount.role !== "ADMIN") {
    return <Navigate to={"/"} replace />;
  }

  const handleSiderCollapse = (collapsed) => {
    if (collapsed) setCollapsed(true);
    else setCollapsed(false);
  };

  return (
    <BooksProvider>
      <TransactionsProvider>
        <Layout className={styles.layout}>
          <Header />
          <Layout className={styles.body}>
            <Sider
              breakpoint="md"
              collapsed={collapsed}
              collapsible
              trigger={
                collapsed ? (
                  <MenuUnfoldOutlined
                    style={{ fontSize: 16, color: "#72BF78" }}
                  />
                ) : (
                  <MenuFoldOutlined
                    style={{ fontSize: 16, color: "#72BF78" }}
                  />
                )
              }
              style={{
                position: "fixed",
              }}
              onCollapse={handleSiderCollapse}
            >
              <NavigationBar />
            </Sider>
            <Content
              className={styles.content}
              style={{
                marginLeft: collapsed ? "80px" : "200px",
                transition: ".2s all linear",
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </TransactionsProvider>
    </BooksProvider>
  );
}
