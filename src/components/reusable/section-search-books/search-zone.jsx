import { useState } from "react";
import { Divider, Flex, Switch, Typography } from "antd";
import { BasicSearchBooks } from "./basic-search";
import { AdvancedSearchBooks } from "./advanced-search";

const { Title } = Typography;

export const SearchBooksZone = ({ onSearch }) => {
  const [searchMode, setSearchMode] = useState("basic"); // "basic" | "advanced"

  const handleChangeSearchMode = (isChecked) => {
    setSearchMode(isChecked ? "advanced" : "basic");
  };

  return (
    <Flex vertical gap={16} className="w-full">
      <Flex align="center" justify="space-between">
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
      </Flex>
      {searchMode === "basic" ? (
        <BasicSearchBooks onSearch={onSearch} />
      ) : (
        <>
          <AdvancedSearchBooks onSearch={onSearch} />
          <Divider />
        </>
      )}
    </Flex>
  );
};
