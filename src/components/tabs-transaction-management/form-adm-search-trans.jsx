import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
import { Col, Empty, Form, Row, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { getTransWithConditionsService } from "@/services/transaction/get-w-conditions";
import { getAdmSearchTransOptsService } from "@/services/transaction/get-adm-search-trans-opts";
import { useAntDesign } from "@/hooks/use-ant-design";
import { TblAdmBrwByAccId } from "./tbl-adm-brw-by-acc-id";

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

export const FormAdmSearchTrans = ({ type }) => {
  const { msgApi } = useAntDesign();
  // const [searchParams, setSearchParams] = useSearchParams();
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
      }
    );
  };

  return (
    <div>
      <Form
        form={form}
        name="form-admin-search-transaction"
        className="section mb-4"
      >
        <Row gutter={24}>
          <Col span={24} lg={{ span: 6 }}>
            <Form.Item name="by" label="Search by">
              <Select options={byOptions} onSelect={getSearchOpts}></Select>
            </Form.Item>
          </Col>
          <Col span={24} lg={{ span: 8 }}>
            <Form.Item name="id" label="Value">
              <Select
                showSearch
                options={valueOpts}
                loading={mutationGetAdmSearchTransOpts.isPending}
                disabled={mutationGetAdmSearchTransOpts.isPending || !by}
                onSelect={searchTransactionWithConditions}
                placeholder={
                  !by
                    ? ""
                    : mutationGetAdmSearchTransOpts.isPending
                    ? "Loading"
                    : "Select to display"
                }
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>{/* <Col>Total: 24</Col> */}</Row>
      </Form>
      {!by ? (
        <Empty />
      ) : by === "account" ? (
        <TblAdmBrwByAccId
          tableData={tableData}
          loading={mutationGetTransWithConditions.isPending}
        />
      ) : (
        "Book"
      )}
    </div>
  );
};
