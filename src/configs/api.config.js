const apiRoot = "http://localhost:3000/api";

const apiRoute = {
  auth: "/auth",
  accounts: "/accounts",
  books: "/books",
  categories: "/categories",
  transactions: "/transactions",
  renewals: "/renewals",
  histories: "/histories",
  reports: "/reports",
};

export const apiAuthRoute = {
  signUp: `${apiRoute.auth}/sign-up`,
  logIn: `${apiRoute.auth}/log-in`,
  accessToken: `${apiRoute.auth}/access-token`,
  logOut: `${apiRoute.auth}/log-out`,
};

export const apiAccountsRoute = {
  getByListIds: `${apiRoute.accounts}/get-by-list-ids`,
  editInfor: `${apiRoute.accounts}/edit-infor`,
  changePwd: `${apiRoute.accounts}/change-pwd`,
  delete: `${apiRoute.accounts}/delete`,
  getByRole: `${apiRoute.accounts}/get-by-role`,
  getById: `${apiRoute.accounts}/get-by-id`,
  resetPassword: `${apiRoute.accounts}/reset-pwd`,
  adminDelete: `${apiRoute.accounts}/admin-delete`,
};

export const apiBooksRoute = {
  create: `${apiRoute.books}/create`,
  getWithConditions: `${apiRoute.books}/get-w-conditions`,
  edit: `${apiRoute.books}/edit`,
  delete: `${apiRoute.books}/delete`,
  get: `${apiRoute.books}/get`,
};

export const apiCategoriesRoute = {
  create: `${apiRoute.categories}/create`,
  getWithConditions: `${apiRoute.categories}/get-w-conditions`,
  edit: `${apiRoute.categories}/edit`,
  delete: `${apiRoute.categories}/delete`,
};

export const apiTransactionsRoute = {
  create: `${apiRoute.transactions}/create`,
  getBorrowingByAccountId: `${apiRoute.transactions}/get-borrowing-by-account-id`,
  return: `${apiRoute.transactions}/return`,
  renewal: `${apiRoute.transactions}/renewal`,
  getBorrowingByBookId: `${apiRoute.transactions}/get-borrowing-by-book-id`,
  countByBookId: `${apiRoute.transactions}/count-by-book-id`,
  getReturnedByAccountId: `${apiRoute.transactions}/get-returned-by-account-id`,
  getTransactionsByDateRange: `${apiRoute.transactions}/get-transactions-by-date-range`,

  reqForPass: `${apiRoute.transactions}/req-for-pass`,
  cancelPassReq: `${apiRoute.transactions}/cancel-pass-req`,
  getRequestingByBookId: `${apiRoute.transactions}/get-requesting-by-book-id`,
  passBook: `${apiRoute.transactions}/pass-book`,

  getAdmSearchTransOpts: `${apiRoute.transactions}/get-adm-search-trans-opts`,
  getWithConditions: `${apiRoute.transactions}/get-w-conditions`,
  getById: `${apiRoute.transactions}/get-by-id`,
};

export const apiRenewalsRoute = {
  countByTransactionId: `${apiRoute.renewals}/count-by-transaction-id`,
  getByTransactionId: `${apiRoute.renewals}/get-by-transaction-id`,
  create: `${apiRoute.renewals}/create`,
};

export const apiHistoriesRoute = {
  getByAccountId: `${apiRoute.histories}/get-by-account-id`,
  getByDateRange: `${apiRoute.histories}/get-by-date-range`,
};

export const apiReportsRoute = {
  getAll: `${apiRoute.reports}/get-all`,
  create: `${apiRoute.reports}/create`,
};

export default apiRoot;
