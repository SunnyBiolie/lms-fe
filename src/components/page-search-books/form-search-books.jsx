import { useCallback, useEffect, useState } from "react";
import { Row, Space, Switch, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { searchBooksService } from "@/services/books/search";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { useAntDesign } from "@/hooks/use-ant-design";
import { BasicSearchBooks } from "./basic-search";
import { AdvancedSearchBooks } from "./advanced-search";
import { TableSearchResult } from "./table-search-result";
import { useSearchParams } from "react-router-dom";
import { configTable_Book } from "@/configs/table.config";

const { Title } = Typography;

export const FormSearchBooks = () => {
  const { msgApi } = useAntDesign();
  const mutationSearchBooks = useMutation({
    mutationFn: searchBooksService,
  });
  // eslint-disable-next-line no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  const [searchMode, setSearchMode] = useState("basic");
  const [searchValues, setSearchValues] = useState();
  const [paginationParams, setPaginationParams] = useState({
    current: configTable_Book.defaultCurrent,
    pageSize: configTable_Book.defaultPageSize,
  });
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    if (!searchValues) return;

    searchBooks("search", searchValues, paginationParams);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  useEffect(() => {
    if (!searchValues) return;
    console.log(searchValues);

    searchBooks("paginate", searchValues, paginationParams);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);

  const handleChangeSearchMode = (isChecked) => {
    setSearchMode(isChecked ? "advanced" : "basic");
    setSearchParams({});
  };

  const searchBooks = useCallback(
    (action, searchValues, paginationParams) => {
      mutationSearchBooks.mutate(
        { action, searchValues, paginationParams },
        {
          onSuccess: (res) => {
            setSearchResults(res.data.data);
          },
          onError: (err) => {
            msgApi("error", err.response.data.message);
            checkToLogOut(err);
          },
        }
      );
    },
    [msgApi, mutationSearchBooks]
  );

  return (
    <Space size="middle" direction="vertical">
      <div className="section">
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "12px" }}
        >
          <Title level={5} style={{ margin: "4px 0 4px" }}>
            Search zone
          </Title>
          <Switch
            size="medium"
            checkedChildren="Advanced"
            unCheckedChildren="Basic"
            defaultChecked={searchMode === "advanced"}
            onChange={handleChangeSearchMode}
          />
        </Row>
        {searchMode === "basic" ? (
          <BasicSearchBooks setSearchValues={setSearchValues} />
        ) : (
          <AdvancedSearchBooks setSearchValues={setSearchValues} />
        )}
      </div>
      <TableSearchResult
        loading={mutationSearchBooks.isPending}
        data={searchResults}
        searchValues={searchValues}
        setPaginationParams={setPaginationParams}
      />
    </Space>
  );
};
