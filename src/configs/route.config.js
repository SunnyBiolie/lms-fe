import {
  BookOutlined,
  FundOutlined,
  HeartOutlined,
  HistoryOutlined,
  ReconciliationOutlined,
  SearchOutlined,
  TableOutlined,
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
    Icon: TableOutlined,
  },
  search: {
    pathname: "/search",
    label: "Search",
    Icon: SearchOutlined,
  },
  favorites: {
    pathname: "/favorites",
    label: "Favorites",
    Icon: HeartOutlined,
  },
  history: {
    pathname: "/history",
    label: "History",
    Icon: HistoryOutlined,
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
