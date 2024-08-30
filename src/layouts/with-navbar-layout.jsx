import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { NavigationBar } from "@/components/navigation-bar";
import { useRouteProtected } from "@/hooks/use-route-protected";
import { createStyles } from "antd-style";
import BooksProvider from "@/providers/books-provider";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  header: css`
    background-color: #141414;
    border-bottom: 1px solid #3b3b3b;
    padding: 0 12px;
    text-align: center;
  `,
  content: css`
    height: 100%;
    min-height: 360px;
    padding: 24px;
    background-color: #222222;
    overflow: auto;
  `,
}));

export default function WithNavBarLayout() {
  const { styles } = useStyles();

  const { currentAccount } = useCurrentAccount();
  const { inProtectedRoutes } = useRouteProtected();

  if (!currentAccount) return;

  if (inProtectedRoutes && currentAccount.role !== "ADMIN") {
    return <Navigate to={"/"} replace />;
  }

  return (
    <BooksProvider>
      <Layout style={{ width: "100vw", height: "100vh" }}>
        <Layout.Header className={styles.header}>
          Library Management System {currentAccount.userName}
        </Layout.Header>
        <Layout>
          <Layout.Sider width={200}>
            <NavigationBar />
          </Layout.Sider>
          <Layout.Content className={styles.content}>
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </BooksProvider>
  );
}
