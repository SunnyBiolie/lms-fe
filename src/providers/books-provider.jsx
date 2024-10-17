import { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getCategoriesWithConditionsService } from "@/services/categories/get-w-conditions";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";

export const BooksContext = createContext();

export default function BooksProvider({ children }) {
  const { msgApi } = useAntDesign();

  const mutationGetCategoriesWithConditions = useMutation({
    mutationFn: getCategoriesWithConditionsService,
  });

  const [listOfCategories, setListOfCategories] = useState();
  const [isLoadingCate, setIsLoadingCate] = useState(false);

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
          checkToLogOut(axiosError);
        },
        onSettled: () => setIsLoadingCate(false),
      }
    );
  };

  useEffect(() => {
    loadListCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
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
