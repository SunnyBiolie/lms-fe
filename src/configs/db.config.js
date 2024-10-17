export const Table_Account = {
  id: "id",
  fullName: "fullName",
  address: "address",
  phoneNumber: "phoneNumber",
  email: "email",
  birthDate: "birthDate",
  userName: "userName",
  role: "role",
  Transactions: "Transactions",
};

export const Table_Book = {
  id: "id",
  title: "title",
  author: "author",
  publisher: "publisher",
  publicationDate: "publicationDate",
  pages: "pages",
  imageLink: "imageLink",
  quantity: "quantity",
  8: "createdAt",
  Categories: "Categories",
  isSpecial: "isSpecial",
  price: "price",
  Transactions: "Transactions",
  LikedBy: "LikedBy",
};

export const Table_Category = {
  id: "id",
  name: "name",
  Books: "Books",
};

export const Table_Transaction = {
  id: "id",
  1: "accountId",
  bookId: "bookId",
  borrowedAt: "borrowedAt",
  dueDate: "dueDate",
  returnedAt: "returnedAt",
  receivedFrom: "receivedFrom",
  passedFor: "passedFor",
  Account: "Account",
  Book: "Book",
  Renewals: "Renewals",
};

export const Table_Renewal = {
  id: "id",
  transactionId: "transactionId",
  renewedAt: "renewedAt",
  dueDate: "dueDate",
  Transaction: "Transaction",
};

export const Table_History = {
  bookTitle: "bookTitle",
  dueDates: "dueDates",
  returnedAt: "returnedAt",
};

export const Table_Report = {
  id: "id",
  month: "month",
  year: "year",
  createdAt: "createdAt",

  ReportAccounts: "ReportAccounts",
  ReportBooks: "ReportBooks",
  MembershipLogs: "MembershipLogs",
};

export const Table_RpAccount = {
  id: "id",
  reportId: "reportId",
  accountId: "accountId",
  borrowCount: "borrowCount",
  overdueCount: "overdueCount",
  isViewedByUser: "isViewedByUser",

  Report: "Report",
  Account: "Account",
};

export const Table_RpBook = {
  id: "id",
  reportId: "reportId",
  bookId: "bookId",
  accountId: "accountId",
  borrowedCount: "borrowedCount",

  Report: "Report",
  Book: "Book",
};

export const Table_MembershipLogs = {
  id: "id",
  accountId: "accountId",
  reportId: "reportId",
  from: "from",
  to: "to",
  createdAt: "createdAt",

  Account: "Account",
  Report: "Report",
};

export const Field_Account_Role = {
  admin: "ADMIN",
  user: "USER",
  member: "MEMBER",
  vip: "VIP",
};
