import { useState } from "react";
import { Button, Drawer } from "antd";
import { FormChangeProfileInfo } from "../tabs-profile-page/form-change-profile-info";

export const BtnEditAccount = ({ account, fetchListAccounts }) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button size="small" onClick={showDrawer}>
        Edit
      </Button>
      <Drawer
        destroyOnClose
        title="Edit Account"
        onClose={onClose}
        open={open}
        width={400}
      >
        <FormChangeProfileInfo
          account={account}
          onAfterSaveChange={fetchListAccounts}
        />
      </Drawer>
    </>
  );
};
