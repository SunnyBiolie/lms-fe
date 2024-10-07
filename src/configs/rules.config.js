import dayjs from "dayjs";

export const Rule_Required = [
  {
    required: true,
  },
];

export const Rule_phoneNumber = [
  {
    required: true,
    message: "Please enter phone number",
  },
  {
    pattern: /^[+]?[(]?[0-9]{1,4}[)]?[\s]?[0-9]{3}[-\s.]?[0-9]{4}$/g,
    message: "Invalid phone number, ex: (880) 978-0446",
  },
];

export const Rule_email = [
  {
    required: true,
    message: "Please enter email address",
  },
  {
    type: "email",
    message: "Invalid email address",
  },
];

export const maxCategoryLength = 24;

export const minAddressLength = 8;
export const maxAddressLength = 64;
export const minUserNameLength = 3;
export const maxUserNameLength = 16;
export const minFullNameLength = 3;
export const maxFullNameLength = 64;
export const minPasswordLength = 4;
export const maxPasswordLength = 16;
export const minBookTitleLength = 3;
export const maxBookTitleLength = 128;
export const minAuthorLength = 3;
export const maxAuthorLength = 64;
export const minPublisherLength = 3;
export const maxPublisherLength = 64;
export const minBookPrice = 10000;
export const maxBookPrice = 10000000;

export const maxPublicationYear = dayjs(new Date().getFullYear().toString());

export const ruleRequired = (name) => ({
  required: true,
  message: name ? `Please enter ${name}` : "This field is required",
});
export const ruleMinLength = (min = 3) => ({
  min,
  message: `A minimum length of ${min} is required`,
});

export const ruleMaxLength = (max = 24) => ({
  max,
  message: `A maximum length of ${max} is required`,
});

export const ruleNotBlank = () => ({
  whitespace: true,
  message: `This filed cannot be a blank character`,
});

export const bookPriceForVIP = 1000000;

export const formRule_bookTitle = [
  {
    required: true,
    message: "Please enter book title",
  },
  ruleMinLength(minBookTitleLength),
  ruleMaxLength(maxBookTitleLength),
];

export const formRule_authorName = [
  {
    required: true,
    message: "Please enter author name",
  },
  ruleMinLength(minAuthorLength),
  ruleMaxLength(maxAuthorLength),
];

export const formRule_publisher = [
  {
    required: true,
    message: "Please enter author name",
  },
  ruleMinLength(minPublisherLength),
  ruleMaxLength(maxPublisherLength),
];

export const formRule_categories = [
  {
    required: true,
    message: "Please enter at least one category",
  },
];

export const formRule_publicationYear = [
  {
    required: true,
    message: "Please enter publication year",
  },
];

export const minNumberOfPages = 20;
export const maxNumberOfPages = 100000;

export const formRule_bookPages = [
  {
    required: true,
    message: "Please enter number of pages",
  },
  {
    min: minNumberOfPages,
    type: "number",
  },
  {
    max: maxNumberOfPages,
    type: "number",
  },
];

export const formRule_bookPrice = [
  {
    required: true,
    message: "Please enter price of book",
  },
  {
    min: minBookPrice,
    type: "number",
  },
  {
    max: maxBookPrice,
    type: "number",
  },
];

export const minQuantityOfBooks = 1;
export const maxQuantityOfBooks = 50;

export const formRule_bookQuantity = [
  {
    required: true,
    message: "Please enter total quantity",
  },
  {
    min: minQuantityOfBooks,
    type: "number",
  },
  {
    max: maxQuantityOfBooks,
    type: "number",
  },
];

export const formRule_specialBook = [
  {
    required: true,
    message: "Please select if book is special or not",
  },
];
