import { Navigate, Outlet } from "react-router-dom";
import { createStyles } from "antd-style";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { routePrivate } from "@/configs/route.config";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    position: relative;
    width: 100vw;
    height: 100vh;
    background-image: url("/auth-background.jpg");
    background-position: center;
    background-size: cover;
  `,
  content: css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  `,
  layer: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  `,
}));

export default function AuthLayout() {
  const { styles } = useStyles();

  const { currentAccount } = useCurrentAccount();

  if (currentAccount) return <Navigate to={routePrivate.dashboard.pathname} replace />;

  return (
    <div className={styles.container}>
      <div className={styles.layer} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
