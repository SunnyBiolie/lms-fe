import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getAllCategoriesService } from "@/services/categories/get-all";

export const useCategories = () => {
  const [listOfCategories, setListOfCategories] = useState();

  const mutationGetAllCategories = useMutation({
    mutationFn: getAllCategoriesService,
    onSuccess: (axiosResponse) => {
      const options = axiosResponse.data.listCategories.map((obj) => {
        obj["value"] = obj["id"];
        obj["label"] = obj["name"];

        delete obj["id"];
        delete obj["name"];

        return obj;
      });
      setListOfCategories(options);
    },
  });

  useEffect(() => {
    mutationGetAllCategories.mutate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    listOfCategories,
  };
};
