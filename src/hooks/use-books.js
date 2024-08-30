import { useContext } from "react";
import { BooksContext } from "@/providers/books-provider";

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error("useBooks must be used with BooksProvider");
  }
  return context;
};
