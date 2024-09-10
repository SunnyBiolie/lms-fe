import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { createCategoryService } from "@/services/categories/create";
import { useAntDesign } from "@/hooks/use-ant-design";
import { useBooks } from "@/hooks/use-books";
import { editCategoryService } from "@/services/categories/edit";
import { deleteCategoryService } from "@/services/categories/delete";
import { rules } from "@/configs/admin.config";
import { getCategoriesWithConditionsService } from "@/services/categories/get-w-conditions";
import { Table_Category } from "@/configs/db.config";

export const BtnManageCategory = () => {
  const { msgApi } = useAntDesign();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutationGetCategoriesWithConditions = useMutation({
    mutationFn: getCategoriesWithConditionsService,
  });

  const [isSearching, setIsSearching] = useState();
  const [searchResults, setSearchResults] = useState();

  useEffect(
    () => searchListCategories(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const searchListCategories = (name = "") => {
    setIsSearching(true);
    mutationGetCategoriesWithConditions.mutate(
      {
        name,
      },
      {
        onSuccess: (axiosResponse) => {
          setSearchResults(axiosResponse.data.data);
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setIsSearching(false),
      }
    );
  };

  return (
    <>
      <Button onClick={handleOpenModal}>Category Management</Button>
      <Modal
        destroyOnClose
        title="Category Management"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer=""
      >
        <Tabs
          items={[
            {
              key: "edit/delete",
              label: "Edit/Delete",
              children: (
                <TableManageCategory
                  isSearching={isSearching}
                  searchResults={searchResults}
                  searchListCategories={searchListCategories}
                />
              ),
            },
            {
              key: "add",
              label: "Add new",
              children: (
                <FormAddCategory searchListCategories={searchListCategories} />
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

const FormAddCategory = ({ searchListCategories }) => {
  const { msgApi } = useAntDesign();
  const { loadListCategories } = useBooks();

  const mutationCreateCategory = useMutation({
    mutationFn: createCategoryService,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleAddCategory = async (values) => {
    setIsLoading(true);
    mutationCreateCategory.mutate(values, {
      onSuccess: (axiosResponse) => {
        msgApi("success", axiosResponse.data.message);
        form.resetFields();
        searchListCategories();
        loadListCategories();
      },
      onError: (axiosError) => {
        msgApi("error", axiosError.response.data.message);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Form
      name="add-category"
      form={form}
      layout="vertical"
      onFinish={handleAddCategory}
      disabled={isLoading}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please enter category's name",
          },
          {
            whitespace: true,
          },
          {
            max: rules.maxCharOfCateName,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Flex justify="flex-end">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Add
        </Button>
      </Flex>
    </Form>
  );
};

const TableManageCategory = ({
  isSearching,
  searchResults,
  searchListCategories,
}) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [editingId, setEditingId] = useState();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (pagi) => {
    setPagination({
      current: pagi.current,
      pageSize: pagi.pageSize,
    });
  };

  const handleSearch = async (values) => {
    setPagination({
      current: 1,
      pageSize: 5,
    });
    searchListCategories(values.name);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value, record) => (
        <EditableCell
          category={value}
          id={record.id}
          editingId={editingId}
          setEditingId={setEditingId}
          form={form}
          setIsLoading={setIsLoading}
          searchListCategories={searchListCategories}
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <CategoryAction
          category={record}
          editingId={editingId}
          setEditingId={setEditingId}
          form={form}
          isLoading={isLoading}
          searchListCategories={searchListCategories}
          setPagination={setPagination}
        />
      ),
      width: 160,
    },
  ];

  return (
    <>
      <Form name="search-category" onFinish={handleSearch} disabled={editingId}>
        <Row gutter={8}>
          <Col span={18}>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button className="w-full" htmlType="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        size="small"
        dataSource={searchResults}
        columns={columns}
        rowKey={(r) => r.id}
        pagination={{
          hideOnSinglePage: true,
          position: ["bottomCenter"],
          current: pagination.current,
          pageSize: pagination.pageSize,
          disabled: !!editingId,
        }}
        onChange={handleChangePage}
        loading={isSearching}
      />
    </>
  );
};

const EditableCell = ({
  category,
  id,
  editingId,
  setEditingId,
  form,
  setIsLoading,
  searchListCategories,
}) => {
  const editable = id === editingId;

  const { msgApi } = useAntDesign();

  const { loadListCategories } = useBooks();
  const mutationEditCategory = useMutation({ mutationFn: editCategoryService });

  const handleEditCategory = (values) => {
    if (!editable || !form) return;

    setIsLoading(true);

    mutationEditCategory.mutate(
      {
        categoryId: id,
        name: values.name,
      },
      {
        onSuccess: (axiosResponse) => {
          form.resetFields();
          setEditingId(undefined);
          loadListCategories();
          searchListCategories();
          msgApi("success", axiosResponse.data.message);
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setIsLoading(false),
      }
    );
  };

  if (editable) {
    return (
      <Form
        form={form}
        name="edit-category"
        size="small"
        onFinish={handleEditCategory}
      >
        <Form.Item
          name="name"
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Category is required",
            },
            {
              max: rules.maxCharOfCateName,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }

  return <span style={{ textTransform: "capitalize" }}>{category}</span>;
};

const CategoryAction = ({
  category,
  editingId,
  setEditingId,
  form,
  isLoading,
  searchListCategories,
  setPagination,
}) => {
  const disabled =
    editingId !== undefined && editingId !== category[Table_Category.id];

  const { msgApi } = useAntDesign();
  const { loadListCategories } = useBooks();
  const mutationDelete = useMutation({ mutationFn: deleteCategoryService });

  const handleEdit = () => {
    if (!form) return;

    setEditingId(category[Table_Category.id]);
    form.setFieldValue("name", category[Table_Category.name]);
  };

  const handleSave = () => {
    form.submit();
  };

  const handleDelete = async () => {
    await mutationDelete.mutateAsync(
      {
        params: {
          categoryId: category[Table_Category.id],
        },
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          searchListCategories();
          loadListCategories();
          setPagination((prev) => ({
            ...prev,
            current: 1,
          }));
        },
        onError: (axiosError) =>
          msgApi("error", axiosError.response.data.message),
      }
    );
  };

  return (
    <Space>
      {editingId === category[Table_Category.id] ? (
        <>
          <Button
            type="text"
            size="small"
            onClick={() => setEditingId(undefined)}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={handleSave}
            loading={isLoading}
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <Button
            type="link"
            size="small"
            onClick={handleEdit}
            disabled={disabled || category._count[Table_Category.Books] > 0}
          >
            Edit
          </Button>
          <Popconfirm
            destroyTooltipOnHide
            title={`Delete "${category.name}"`}
            onConfirm={handleDelete}
          >
            <Button
              type="link"
              size="small"
              disabled={disabled || category._count[Table_Category.Books] > 0}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      )}
    </Space>
  );
};
