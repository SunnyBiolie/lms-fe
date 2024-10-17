import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Col, Empty, Form, Row, Select } from "antd";
import { getTransWithConditionsService } from "@/services/transaction/get-w-conditions";
import { getAdmSearchTransOptsService } from "@/services/transaction/get-adm-search-trans-opts";
import { useAntDesign } from "@/hooks/use-ant-design";
import { TblAdmBrwByAccId } from "./tbl-adm-brw-by-acc-id";
import { TblAdmBrwByBookId } from "./tbl-adm-brw-by-book-id";
import { TblAdmReq } from "./tbl-adm-req";
import { createStyles } from "antd-style";

const byOptions = [
  {
    value: "account",
    label: "Account",
  },
  {
    value: "book",
    label: "Book",
  },
];

const useStyles = createStyles(({ css }) => ({
  searchZone: css`
    padding: 16px 0;
  `,
  empty: css`
    padding: 16px 0;
  `,
}));

export const FormAdmSearchTrans = ({ type }) => {
  const { styles } = useStyles();
  const { msgApi } = useAntDesign();
  const [form] = Form.useForm();
  const [by, setBy] = useState();
  const [valueOpts, setValueOpts] = useState();
  const [tableData, setTableData] = useState();

  const mutationGetAdmSearchTransOpts = useMutation({
    mutationFn: getAdmSearchTransOptsService,
  });

  const mutationGetTransWithConditions = useMutation({
    mutationFn: getTransWithConditionsService,
  });

  const getSearchOpts = (value) => {
    form.setFieldValue("id", null);
    setBy(value);
    setTableData(null);
    mutationGetAdmSearchTransOpts.mutate(
      {
        params: {
          type,
          by: value,
        },
      },
      {
        onSuccess: (res) => {
          const opts = res.data.data.map((item) => ({
            value: item.id,
            label: `${item.label} (${item.count})`,
          }));
          setValueOpts(opts);
          setTableData(null);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
          form.setFieldValue("id", valueOpts);
        },
      }
    );
  };

  const searchTransactionWithConditions = (value) => {
    mutationGetTransWithConditions.mutate(
      {
        params: {
          type,
          by,
          id: value,
        },
      },
      {
        onSuccess: (res) => {
          setTableData(res.data.data);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
        },
      }
    );
  };

  return (
    <>
      <Form
        form={form}
        name={`form-admin-search-${type}`}
        className={styles.searchZone}
      >
        <Row gutter={24}>
          <Col span={24} lg={{ span: 8 }}>
            <Form.Item name="by" label="Search by">
              <Select
                options={byOptions}
                onSelect={getSearchOpts}
                placeholder="Account or Book"
              ></Select>
            </Form.Item>
          </Col>
          <Col span={24} lg={{ span: 10 }}>
            <Form.Item name="id" label="Value">
              <Select
                showSearch
                options={valueOpts}
                loading={mutationGetAdmSearchTransOpts.isPending}
                disabled={mutationGetAdmSearchTransOpts.isPending || !by}
                onSelect={searchTransactionWithConditions}
                placeholder={
                  !by
                    ? "Missing search by"
                    : mutationGetAdmSearchTransOpts.isPending
                    ? "Loading..."
                    : "Select to display data"
                }
                optionFilterProp="label"
              ></Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {!tableData ? (
        <Empty
          description="Nothing to show. Please wait until you select your search criteria"
          className={styles.empty}
        />
      ) : type === "borrowing" ? (
        by === "account" ? (
          <TblAdmBrwByAccId
            tableData={tableData}
            loading={mutationGetTransWithConditions.isPending}
          />
        ) : (
          <TblAdmBrwByBookId
            tableData={tableData}
            loading={mutationGetTransWithConditions.isPending}
          />
        )
      ) : type === "requesting" ? (
        <TblAdmReq
          tableData={tableData}
          loading={mutationGetTransWithConditions.isPending}
        />
      ) : by === "account" ? (
        <TblAdmBrwByAccId
          tableData={tableData}
          loading={mutationGetTransWithConditions.isPending}
          type={type}
        />
      ) : (
        <TblAdmBrwByBookId
          tableData={tableData}
          loading={mutationGetTransWithConditions.isPending}
          type={type}
        />
      )}
    </>
  );
};
