import { Descriptions } from "antd";
import { Table_Book } from "@/configs/db.config";
import dayjs from "dayjs";

export const DescriptionsBookInfor = ({ book }) => {
  return (
    <Descriptions
      title="Book information"
      className="section"
      items={[
        {
          key: Table_Book.title,
          label: "Title",
          children: book[Table_Book.title],
        },
        {
          key: Table_Book.author,
          label: "Author",
          children: book[Table_Book.author],
        },
        {
          key: Table_Book.publisher,
          label: "Publisher",
          children: book[Table_Book.publisher],
        },
        {
          key: Table_Book.publicationDate,
          label: "Publication year",
          children: dayjs(book[Table_Book.publicationDate]).format("YYYY"),
        },
        {
          key: Table_Book.pages,
          label: "Pages",
          children: book[Table_Book.pages],
        },
        {
          key: Table_Book.price,
          label: "Price",
          children: book[Table_Book.price].toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        },
        {
          key: Table_Book.isSpecial,
          label: "Special book",
          children: book[Table_Book.isSpecial] ? "Yes" : "No",
        },
        {
          key: Table_Book.quantity,
          label: "Total quantity",
          children: book[Table_Book.quantity],
        },
        {
          key: "available",
          label: "Available",
          children: null,
        },
      ]}
    />
  );
};
