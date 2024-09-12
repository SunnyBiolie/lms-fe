import { getHistoriesByDateRangeService } from "@/services/histories/get-by-date-range";
import { useMutation } from "@tanstack/react-query";
import { Col, DatePicker, Form, Radio, Row, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StatisticPage() {
  const mutationGetHistoriesByDateRange = useMutation({
    mutationFn: getHistoriesByDateRangeService,
  });
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState();

  const [topBook, setTopBook] = useState("5");
  const [type, setType] = useState("book");

  const fetchTransactions = async (values = {}) => {
    setIsLoading(true);
    const axiosResponse = await mutationGetHistoriesByDateRange.mutateAsync(
      values
    );
    setData(axiosResponse.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValuesChange = (values) => {
    if (values.range) {
      fetchTransactions(values);
    }
    if (values["top-of-book"]) {
      setTopBook(values["top-of-book"]);
      switch (values["top-of-book"]) {
        case "5":
          break;
        case "10":
          break;
        default:
          throw new Error("Invalid value");
      }
    }
    if (values.type) {
      setType(values.type);
    }
  };

  const handleFieldsChange = (changedFields) => {
    if (
      changedFields[0] &&
      changedFields[0].name.includes("range") &&
      changedFields[0].value === null
    ) {
      fetchTransactions();
    }
  };

  const filterData = () => {
    if (!data) return;

    if (type === "book") {
      const ids = data.map((tr) => tr.bookId);
      const uniqueIds = [...new Set(ids)];
      const res = [];
      uniqueIds.forEach((id, index) => {
        const arr = data.filter((item) => item.bookId === id);
        res[index] = {
          title: arr[0].bookTitle,
          count: arr.length,
        };
      });

      res.sort((a, b) => a.count - b.count);
      res.splice(0, res.length - Number(topBook));

      setFilter(res);
    } else if (type === "category") {
      let categoriesName = [];
      data.forEach((his) => {
        categoriesName.push(...his.categoriesName);
      });
      const uniqueName = [...new Set(categoriesName)];
      const res = [];
      uniqueName.forEach((name, index) => {
        const arr = categoriesName.filter((n) => n === name);
        res[index] = {
          name: arr[0],
          count: arr.length,
        };
      });
      setFilter(res);
    }
  };

  useEffect(() => {
    filterData();
  }, [data, topBook, type]);

  return (
    <>
      <Row className="h-full w-full">
        <Col
          span={24}
          lg={{ span: 8, push: 16 }}
          xl={{ span: 6, push: 18 }}
          className="section"
        >
          <Form
            name="form_statistic"
            onValuesChange={handleValuesChange}
            onFieldsChange={handleFieldsChange}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name="type" initialValue={type}>
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="book">Book</Radio.Button>
                    <Radio.Button value="category">Category</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="range">
                  <DatePicker.RangePicker
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      return current && current > dayjs().endOf("day");
                    }}
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              {type === "book" && (
                <Col span={24}>
                  <Form.Item name="top-of-book" initialValue={"5"}>
                    <Select
                      options={[
                        {
                          value: "5",
                          label: "Top 5",
                        },
                        {
                          value: "10",
                          label: "Top 10",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </Col>
        <Col
          span={24}
          lg={{ span: 16, pull: 8 }}
          xl={{ span: 18, pull: 6 }}
          style={{ position: "relative", padding: "20px" }}
        >
          {isLoading ? (
            <div
              style={{
                position: "absolute",
              }}
              className="w-full h-full"
            >
              <Spin className="absolute-center" />
            </div>
          ) : type === "book" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={500} height={300} data={filter}>
                <CartesianGrid strokeOpacity={0.3} />
                <XAxis hide />
                <YAxis tickLine={false} allowDecimals={false}>
                  <Label value="Times" angle={-90} />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#f1f1f1"
                  activeBar={<Rectangle fill="#fb3453" stroke="transparent" />}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            type === "category" && <CustomPieChart data={filter} />
          )}
        </Col>
      </Row>
    </>
  );
}

function CustomTooltip({ payload, active }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Title: ${payload[0].payload.title}`}</p>
        <p className="intro">{`Number of times borrowed: ${payload[0].payload.count}`}</p>
      </div>
    );
  }

  return null;
}

const CustomPieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          fill="#eee"
          activeShape={renderActiveShape}
          activeIndex={activeIndex}
          onMouseEnter={onPieEnter}
        />
        {/* <Tooltip /> */}
      </PieChart>
    </ResponsiveContainer>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    // fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const fill = "#fb3453";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"#f1f1f1"}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#f1f1f1"
      >{`${payload.name}: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};
