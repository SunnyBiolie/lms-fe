import {
  BookOutlined,
  FundOutlined,
  ReconciliationOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const routeAuth = {
  logIn: {
    pathname: "/auth/log-in",
  },
  signUp: {
    pathname: "/auth/sign-up",
  },
};

export const routeUser = {
  dashboard: {
    pathname: "/",
    label: "Dashboard",
  },
  history: {
    pathname: "/history",
    label: "History",
  },
};

export const routeAdmin = {
  bookMangement: {
    pathname: "/admin/book-management",
    label: "Books",
    Icon: BookOutlined,
  },
  userMangement: {
    pathname: "/admin/user-management",
    label: "Accounts",
    Icon: UserOutlined,
  },
  transactionsManagement: {
    pathname: "/admin/transaction-management",
    label: "Transactions",
    Icon: ReconciliationOutlined,
  },
  statistic: {
    pathname: "/admin/statistics",
    label: "Statistics",
    Icon: FundOutlined,
  },
};
