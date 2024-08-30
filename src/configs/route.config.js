export const routeAuth = {
  logIn: {
    pathname: "/auth/log-in",
  },
  signUp: {
    pathname: "/auth/sign-up",
  },
};

export const routePrivate = {
  dashboard: {
    pathname: "/",
    label: "Dashboard",
  },
  borrowing: {
    pathname: "/history",
    label: "History",
  },
};

export const routeProtected = {
  bookMangement: {
    pathname: "/admin/book-management",
    label: "Book Mangement",
  },
  userMangement: {
    pathname: "/admin/user-management",
    label: "User Mangement",
  },
};
