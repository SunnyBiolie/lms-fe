import { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getBooksWithConditionsService } from "@/services/books/get-w-conditions";
import { table } from "@/configs/admin.config";
import { getCategoriesWithConditionsService } from "@/services/categories/get-w-conditions";
import { useAntDesign } from "@/hooks/use-ant-design";

export const BooksContext = createContext();

export default function BooksProvider({ children }) {
  const { msgApi } = useAntDesign();

  const mutationGetBooks = useMutation({
    mutationFn: getBooksWithConditionsService,
  });
  const mutationGetCategoriesWithConditions = useMutation({
    mutationFn: getCategoriesWithConditionsService,
  });

  const [listOfCategories, setListOfCategories] = useState();
  const [isLoadingCate, setIsLoadingCate] = useState(false);

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

  const loadListCategories = () => {
    setIsLoadingCate(true);
    mutationGetCategoriesWithConditions.mutate(
      {
        name: "",
      },
      {
        onSuccess: (axiosResponse) => {
          const optionsFormat = axiosResponse.data.data.map((obj) => {
            obj["value"] = obj["id"];
            obj.label = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);

            delete obj["id"];
            delete obj["name"];

            return obj;
          });
          setListOfCategories(optionsFormat);
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setIsLoadingCate(false),
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

  useEffect(() => {
    loadListCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    isLoading,
    listOfBooks,
    loadListOfBooks,
    setSearchValues,
    paginationParams,
    setPaginationParams,
    isLoadingCate,
    listOfCategories,
    loadListCategories,
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
}
