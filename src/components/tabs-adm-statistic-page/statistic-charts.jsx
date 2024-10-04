import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getStatisticByDateService } from "@/services/reports/get-by-date";
import {
  Col,
  DatePicker,
  Empty,
  Flex,
  Form,
  Row,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { useAntDesign } from "@/hooks/use-ant-design";
import {
  Table_Account,
  Table_Book,
  Table_Report,
  Table_RpAccount,
  Table_RpBook,
} from "@/configs/db.config";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { MyTable } from "../my/my-table";
import dayjs from "dayjs";

const { Paragraph } = Typography;

export function StatisticCharts() {
  const { msgApi } = useAntDesign();

  const mutationGetStatistic = useMutation({
    mutationFn: getStatisticByDateService,
  });

  const [form] = Form.useForm();
  const [time, setTime] = useState("year");
  const [accountsStatistic, setAccountsStatistic] = useState();
  const [booksStatistic, setBooksStatistic] = useState();
  const [tableData, setTableData] = useState();

  const handleTypeChange = (value) => {
    setTime(value);
    form.setFieldValue("time", null);
  };

  const handleValuesChange = (values) => {
    const y = new Date(values.time).getFullYear();
    const m = new Date(values.time).getMonth();
    const q = m === 0 ? 1 : m === 3 ? 2 : m === 6 ? 3 : m === 9 ? 4 : 5;
    const value = {
      year: y,
      quarter: q,
      month: m + 1,
    };
    calculateStatictis(value);
  };

  const calculateStatictis = (value) => {
    mutationGetStatistic.mutate(
      {
        time,
        value,
      },
      {
        onSuccess: (res) => {
          const resData = res.data.data;
          const statAccounts = calRpAcc(resData);
          statAccounts.sort(
            (a, b) =>
              -a[Table_RpAccount.borrowCount] + b[Table_RpAccount.borrowCount]
          );
          setAccountsStatistic(statAccounts);

          const mergedReportBooks = [];
          for (const rp of resData) {
            mergedReportBooks.push(...rp[Table_Report.ReportBooks]);
          }
          const uniqueBooksId = [
            ...new Set(
              mergedReportBooks.map((rpBook) => rpBook[Table_RpBook.bookId])
            ),
          ];
          const statBooks = uniqueBooksId.map((bookId) => {
            const arr = mergedReportBooks.filter(
              (rpBook) => rpBook[Table_RpBook.bookId] === bookId
            );
            const r = arr.reduce(
              (prev, curr) => {
                return {
                  borrowedCount:
                    prev[Table_RpBook.borrowedCount] +
                    curr[Table_RpBook.borrowedCount],
                };
              },
              {
                borrowedCount: 0,
              }
            );
            r[Table_RpBook.bookId] = arr[0][Table_RpBook.bookId];
            r[Table_RpBook.Book] = arr[0][Table_RpBook.Book];
            return r;
          });

          const t = statBooks.sort(
            (a, b) =>
              -a[Table_RpBook.borrowedCount] + b[Table_RpBook.borrowedCount]
          );
          statBooks.map;

          const uniqueBooksAuthor = [
            ...new Set(
              mergedReportBooks.map(
                (rpBook) => rpBook[Table_RpBook.Book][Table_Book.author]
              )
            ),
          ];
          const statAuthors = uniqueBooksAuthor.map((author) => {
            const arr = mergedReportBooks.filter(
              (rpBook) =>
                rpBook[Table_RpBook.Book][Table_Book.author] === author
            );
            const r = arr.reduce(
              (prev, curr) => {
                return {
                  borrowedCount:
                    prev[Table_RpBook.borrowedCount] +
                    curr[Table_RpBook.borrowedCount],
                };
              },
              {
                borrowedCount: 0,
              }
            );
            // r[Table_RpBook.bookId] = arr[0][Table_RpBook.bookId];
            r.author = arr[0][Table_RpBook.Book][Table_Book.author];
            return r;
          });

          const au = statAuthors.sort(
            (a, b) =>
              -a[Table_RpBook.borrowedCount] + b[Table_RpBook.borrowedCount]
          );

          const temp = [];
          mergedReportBooks.forEach((rpBook) => {
            rpBook[Table_RpBook.Book][Table_Book.Categories].forEach((item) =>
              temp.push(item.name)
            );
          });
          const uniqueBooksCates = [...new Set(temp)];
          const statCates = uniqueBooksCates.map((cate) => {
            const arr = mergedReportBooks.filter((rpBook) => {
              return (
                rpBook[Table_RpBook.Book][Table_Book.Categories].findIndex(
                  (item) => item.name === cate
                ) !== -1
              );
            });
            const r = arr.reduce(
              (prev, curr) => {
                return {
                  borrowedCount:
                    prev[Table_RpBook.borrowedCount] +
                    curr[Table_RpBook.borrowedCount],
                };
              },
              {
                borrowedCount: 0,
              }
            );
            // r[Table_RpBook.bookId] = arr[0][Table_RpBook.bookId];
            r.category = cate;
            return r;
          });
          const ca = statCates.sort(
            (a, b) =>
              -a[Table_RpBook.borrowedCount] + b[Table_RpBook.borrowedCount]
          );

          if (t[0]) {
            const val = {
              title: {
                name: t[0]
                  ? t[0][Table_RpBook.Book][Table_Book.title]
                  : undefined,
                value: t[0] ? t[0][Table_RpBook.borrowedCount] : undefined,
              },
              author: {
                name: au[0] ? au[0][Table_Book.author] : undefined,
                value: au[0] ? au[0][Table_RpBook.borrowedCount] : undefined,
              },
              category: {
                name: ca[0] ? ca[0].category : undefined,
                value: ca[0] ? ca[0][Table_RpBook.borrowedCount] : undefined,
              },
            };
            setBooksStatistic(val);
          } else {
            setBooksStatistic(undefined);
          }
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  useEffect(() => {
    if (!accountsStatistic || accountsStatistic.length === 0 || !booksStatistic)
      return;

    setTableData([
      {
        label: "Account",
        name: accountsStatistic[0][Table_RpAccount.Account][
          Table_Account.fullName
        ],
        times: accountsStatistic[0][Table_RpAccount.borrowCount],
      },
      {
        label: "Book",
        name: booksStatistic.title.name,
        times: booksStatistic.title.value,
      },
      {
        label: "Author",
        name: booksStatistic.author.name,
        times: booksStatistic.author.value,
      },
      {
        label: "Category",
        name: booksStatistic.category.name,
        times: booksStatistic.category.value,
      },
    ]);
  }, [accountsStatistic, booksStatistic]);

  return (
    <>
      <Paragraph strong underline style={{ padding: "8px 16px" }}>
        Current view: View statistics
      </Paragraph>
      <Row className="h-full w-full">
        <Col
          span={24}
          lg={{ span: 8, push: 16 }}
          xl={{ span: 6, push: 18 }}
          className="section"
          style={
            {
              // position: "sticky",
              // top: "80px",
              // right: "0px",
              // height: "auto",
            }
          }
        >
          <Form
            form={form}
            name="form_statistic"
            onValuesChange={handleValuesChange}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Segmented
                  defaultValue={time}
                  options={[
                    {
                      label: "Year",
                      value: "year",
                    },
                    {
                      label: "Quarter",
                      value: "quarter",
                    },
                    {
                      label: "Month",
                      value: "month",
                    },
                  ]}
                  onChange={handleTypeChange}
                  style={{ marginBottom: "24px" }}
                />
              </Col>
              <Col span={24}>
                <Form.Item name="time">
                  <DatePicker
                    picker={time}
                    cellRender={(current, { originNode, type }) => {
                      if (type === "quarter")
                        return (
                          <div style={{ margin: "8px 0" }}>
                            <p style={{ margin: 0 }}>Quarter</p>
                            <p style={{ margin: 0 }}>
                              {dayjs(current).format("Q")}
                            </p>
                          </div>
                        );
                      else return originNode;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col
          span={24}
          lg={{ span: 16, pull: 8 }}
          xl={{ span: 18, pull: 6 }}
          style={{
            position: "relative",
            paddingRight: "8px",
          }}
        >
          {mutationGetStatistic.isPending ? (
            <Spin />
          ) : (
            <Flex vertical className="section">
              {accountsStatistic &&
              accountsStatistic.length > 0 &&
              booksStatistic ? (
                <>
                  {/* <Paragraph strong>Top of :</Paragraph> */}
                  <MyTable
                    data={tableData}
                    items={[
                      {
                        title: "Label",
                        dataIndex: "label",
                      },
                      {
                        title: "Name",
                        dataIndex: "name",
                      },
                      {
                        title: "Times",
                        dataIndex: "times",
                      },
                    ]}
                  />
                </>
              ) : (
                <Empty />
              )}
            </Flex>
          )}
        </Col>
      </Row>
    </>
  );
}

const calRpAcc = (resData) => {
  const mergedReportAccounts = [];
  for (const rp of resData) {
    mergedReportAccounts.push(...rp[Table_Report.ReportAccounts]);
  }
  const uniqueAccountsId = [
    ...new Set(
      mergedReportAccounts.map((rpAcc) => rpAcc[Table_RpAccount.accountId])
    ),
  ];
  const stat = uniqueAccountsId.map((accId) => {
    const arr = mergedReportAccounts.filter(
      (rpAcc) => rpAcc[Table_RpAccount.accountId] === accId
    );
    const r = arr.reduce(
      (prev, curr) => {
        return {
          borrowCount:
            prev[Table_RpAccount.borrowCount] +
            curr[Table_RpAccount.borrowCount],
          overdueCount:
            prev[Table_RpAccount.overdueCount] +
            curr[Table_RpAccount.overdueCount],
        };
      },
      {
        borrowCount: 0,
        overdueCount: 0,
      }
    );
    r[Table_RpAccount.accountId] = arr[0][Table_RpAccount.accountId];
    r[Table_RpAccount.Account] = arr[0][Table_RpAccount.Account];
    return r;
  });
  return stat;
};
