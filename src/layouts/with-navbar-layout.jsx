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

const useStyles = createStyles(({ css }) => ({
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
    background-color: #eee;
    border-radius: 8px;
  `,
}));

const { Sider, Content } = Layout;

export default function WithNavBarLayout() {
  const { styles, theme } = useStyles();

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
                    style={{ fontSize: 16, color: theme.colorPrimary }}
                  />
                ) : (
                  <MenuFoldOutlined
                    style={{ fontSize: 16, color: theme.colorPrimary }}
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
