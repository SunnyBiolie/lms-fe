import { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getBooksWithConditionsService } from "@/services/books/get-w-conditions";
import { table } from "@/configs/admin.config";

export const BooksContext = createContext();

export default function BooksProvider({ children }) {
  const mutationGetBooks = useMutation({
    mutationFn: getBooksWithConditionsService,
  });

  const [searchValues, setSearchValues] = useState();
  const [paginationParams, setPaginationParams] = useState({
    current: table.defaultCurrent,
    pageSize: table.defaultPageSize,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [listOfBooks, setListOfBooks] = useState();

  const loadListOfBooks = (type = "paginate") => {
    setIsLoading(true);

    mutationGetBooks.mutate(
      {
        type,
        searchValues: {
          ...searchValues,
        },
        paginationParams: {
          ...paginationParams,
          current:
            type === "deleteLastItem"
              ? paginationParams.current - 1 >= 0
                ? paginationParams.current - 1
                : 0
              : paginationParams.current,
        },
      },
      {
        onSuccess: (axiosResponse) => {
          setListOfBooks(axiosResponse.data.listBooks);
          setPaginationParams({
            ...paginationParams,
            current:
              type === "goToFirst"
                ? 1
                : type === "deleteLastItem"
                ? paginationParams.current - 1 >= 0
                  ? paginationParams.current - 1
                  : 0
                : paginationParams.current,
            total: axiosResponse.data.total,
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  useEffect(() => {
    loadListOfBooks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.current, paginationParams.pageSize]);

  useEffect(() => {
    loadListOfBooks("goToFirst");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  const contextValue = {
    isLoading,
    listOfBooks,
    loadListOfBooks,
    setSearchValues,
    paginationParams,
    setPaginationParams,
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
}
