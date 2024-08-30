const apiRoot = "http://localhost:3000/api";

const apiRoute = {
  auth: "/auth",
  accounts: "/accounts",
  books: "/books",
  categories: "/categories",
  transactions: "/transactions",
  logs: "/log",
};

export const apiAuthRoute = {
  signUp: `${apiRoute.auth}/sign-up`,
  logIn: `${apiRoute.auth}/log-in`,
  accessToken: `${apiRoute.auth}/access-token`,
  logOut: `${apiRoute.auth}/log-out`,
};

export const apiAccountsRoute = {
  getByListIds: `${apiRoute.accounts}/get-by-list-ids`,
};

export const apiBooksRoute = {
  create: `${apiRoute.books}/create`,
  getWithConditions: `${apiRoute.books}/get-w-conditions`,
  edit: `${apiRoute.books}/edit`,
  delete: `${apiRoute.books}/delete`,
  get: `${apiRoute.books}/get`,
};

export const apiCategoriesRoute = {
  getAll: `${apiRoute.categories}/get-all`,
};

export const apiTransactionsRoute = {
  create: `${apiRoute.transactions}/create`,
  get: `${apiRoute.transactions}/get`,
  return: `${apiRoute.transactions}/return`,
  renewal: `${apiRoute.transactions}/renewal`,
  getByBookId: `${apiRoute.transactions}/get-by-book-id`,
  countByBookId: `${apiRoute.transactions}/count-by-book-id`,
};

export const apiLogsRoute = {
  get: `${apiRoute.logs}/get`,
};

export default apiRoot;
