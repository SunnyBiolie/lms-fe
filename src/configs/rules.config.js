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
    // eslint-disable-next-line no-useless-escape
    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
    message: "Invalid phone number",
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
