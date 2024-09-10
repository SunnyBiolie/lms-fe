import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { NavigationBar } from "@/components/navigation-bar";
import { useRouteProtected } from "@/hooks/use-route-protected";
import { createStyles } from "antd-style";
import BooksProvider from "@/providers/books-provider";
import { Header } from "@/components/header";
import TransactionsProvider from "@/providers/transactions-provider";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  layout: css`
    width: calc(100vw - 17px);
  `,
  content: css`
    min-height: 360px;
    padding: 16px 24px;
    margin: 8px;
    margin-bottom: 0px;
    background-color: #222;
    border-radius: 8px 8px 0 0;
  `,
  c: css``,
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
      <TransactionsProvider>
        <Layout className={styles.layout}>
          <Layout.Sider
            width={200}
            collapsible
            style={{ height: "100vh", position: "sticky", left: 0, top: 0 }}
          >
            <NavigationBar />
          </Layout.Sider>
          <Layout>
            <Header />
            <Layout.Content className={styles.content}>
              <Outlet />
            </Layout.Content>
          </Layout>
        </Layout>
      </TransactionsProvider>
    </BooksProvider>
  );
}
