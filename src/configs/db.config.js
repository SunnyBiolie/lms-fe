/**
 * @field 0: id
 * @field 1: fullName
 * @field 2: address
 * @field 3: phoneNumber
 * @field 4: email
 * @field 5: birthDate
 * @field 6: userName
 * @field 7: passWord
 * @field 8: role
 * @field 9: Transactions
 */
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

/**
 * @field 0: id
 * @field 1: title
 * @field 2: author
 * @field 3: publisher
 * @field 4: publicationDate
 * @field 5: pages
 * @field 6: imageLink
 * @field 7: quantity
 * @field 8: createdAt
 * @field 9: Categories
 * @field 10: Transactions
 */
export const Table_Book = {
  id: "id",
  title: "title",
  author: "author",
  publisher: "publisher",
  publicationDate: "publicationDate",
  pages: "pages",
  6: "imageLink",
  quantity: "quantity",
  8: "createdAt",
  Categories: "Categories",
  isSpecial: "isSpecial",
  price: "price",
  Transactions: "Transactions",
};

export const Table_Category = {
  id: "id",
  name: "name",
  Books: "Books",
};

/**
 * @field 0: id
 * @field 1: accountId
 * @field 2: bookId
 * @field 3: borrowedAt
 * @field 4: dueDates
 * @field 5: returnedAt
 * @field 6: Account
 * @field 7: Book
 */
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
