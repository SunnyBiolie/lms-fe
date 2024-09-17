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
  },
  userMangement: {
    pathname: "/admin/user-management",
    label: "Accounts",
  },
  transactionsManagement: {
    pathname: "/admin/transaction-management",
    label: "Transactions",
  },
  statistic: {
    pathname: "/admin/statistic",
    label: "Statistic",
  },
};
