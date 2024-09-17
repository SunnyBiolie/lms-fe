import { Button, Col, Modal, Row } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export const BtnAdmDetailTrans = ({ record }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleClick = () => {
    openModal();
  };

  return (
    <>
      <Button
        icon={<InfoCircleOutlined />}
        size="small"
        onClick={handleClick}
      ></Button>
      <MdlAdmDetailTrans
        isModalOpen={open}
        closeModal={closeModal}
        record={record}
      />
    </>
  );
};

const MdlAdmDetailTrans = ({ isModalOpen, closeModal, record }) => {
  // const mutation = useMutation({ mutationFn:  });

  const [relativeAccount, setRelativeAccount] = useState();

  useEffect(() => {
    if (isModalOpen && !relativeAccount) {
    }
  }, [isModalOpen, relativeAccount]);

  return (
    <Modal
      destroyOnClose
      title="Detail of Transaction"
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
    >
      <Row>
        <Col span={12}>{record.Account.fullName}</Col>
        <Col span={12}></Col>
      </Row>
    </Modal>
  );
};
