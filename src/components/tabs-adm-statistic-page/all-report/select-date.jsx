import { useState } from "react";
import { createStyles } from "antd-style";
import { Select, Space, Typography } from "antd";
import { Table_Report } from "@/configs/db.config";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  navigator: css`
    width: 20%;
    min-width: 160px;
    max-width: 210px;
  `,
}));

export const SelectDate = ({ reports, onSelect }) => {
  const { styles, cx } = useStyles();

  const yearOptions = [
    ...new Set(reports.map((rp) => rp[Table_Report.year])),
  ].map((year) => ({
    value: year,
  }));

  const [monthOptions, setMonthOptions] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  const handleChangeYear = (value) => {
    const filterByYear = reports.filter(
      (rp) => rp[Table_Report.year] === value
    );
    setMonthOptions(
      filterByYear.map((rp) => ({
        value: rp[Table_Report.id],
        label: Intl.DateTimeFormat("en", {
          month: "long",
        }).format(new Date(rp[Table_Report.year], rp[Table_Report.month] - 1)),
      }))
    );
    setSelectedMonth(null);
  };

  const handleChangeMonth = (value) => {
    setSelectedMonth(value);
    onSelect(value);
  };

  return (
    <Space
      direction="vertical"
      size="small"
      className={cx(styles.navigator, "section")}
    >
      <Typography.Text strong>Year</Typography.Text>
      <Select
        size="small"
        placeholder="Year"
        options={yearOptions}
        className="w-full"
        onChange={handleChangeYear}
      />
      <Typography.Text strong>Month</Typography.Text>
      <Select
        value={selectedMonth}
        size="small"
        placeholder="Month"
        options={monthOptions}
        className="w-full"
        notFoundContent={"No year selected"}
        onChange={handleChangeMonth}
      />
    </Space>
  );
};
