import { useCallback, useEffect, useState } from "react";
import { Flex, Spin, Typography } from "antd";
import { SearchBooksZone } from "./search-zone";
import { useMutation } from "@tanstack/react-query";
import { searchBooksService } from "@/services/books/search";
import { configTable_Book } from "@/configs/table.config";
import { TableBooks } from "../table-books";
import { ResultsTitle } from "./results-title";

const { Text } = Typography;

export const SectionSearchBooks = () => {
  const mutationSearchBooks = useMutation({ mutationFn: searchBooksService });

  const [searchParams, setSearchParams] = useState();
  const [paginationParams, setPaginationParams] = useState({
    current: configTable_Book.defaultCurrent,
    pageSize: configTable_Book.defaultPageSize,
  });
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    if (!searchParams) {
      setSearchResults(searchParams);
      return;
    }

    searchBooks("search", searchParams, paginationParams);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams) return;

    searchBooks("paginate", searchParams, paginationParams);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);

  const handleSearch = (values) => {
    setSearchParams(values);
  };

  const refetch = (type, data) => {
    switch (type) {
      case "paginate":
        setPaginationParams({
          current: data.page,
          pageSize: data.pageSize,
        });
        break;
      case "afterEdit":
        searchBooks("paginate", searchParams, paginationParams);
        break;
    }
  };

  const searchBooks = useCallback(
    (action, searchValues, paginationParams) => {
      mutationSearchBooks.mutate(
        {
          action,
          searchValues,
          paginationParams,
        },
        {
          onSuccess: (res) => {
            setSearchResults(res.data.data);
          },
        }
      );
    },
    [mutationSearchBooks]
  );

  return (
    <Flex vertical gap={16}>
      <div className="section">
        <SearchBooksZone onSearch={handleSearch} />
        {searchResults ? (
          <TableBooks
            isLoading={mutationSearchBooks.isPending}
            data={searchResults}
            refetch={refetch}
            title={() => (
              <ResultsTitle searchParams={searchParams} data={searchResults} />
            )}
          />
        ) : (
          <Flex vertical justify="center" gap={4} style={{ padding: "32px 0" }}>
            {mutationSearchBooks.isPending ? (
              <Spin />
            ) : (
              <>
                <Text className="text-center">Your search form is empty.</Text>
                <Text className="text-center">
                  Please type something and start the search.
                </Text>
                <Text className="text-center">
                  Search results will be displayed here.
                </Text>
              </>
            )}
          </Flex>
        )}
      </div>
    </Flex>
  );
};
