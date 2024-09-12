import { useState } from "react";
import { Button, Divider, Drawer, Popconfirm, Tooltip } from "antd";
import { Table_Account } from "@/configs/db.config";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordService } from "@/services/accounts/reset-pwd";
import { useAntDesign } from "@/hooks/use-ant-design";
import { adminDeleteAccountService } from "@/services/accounts/admin-delete";

export const BtnMoreAction = ({ account, fetchListAccounts }) => {
  const { msgApi } = useAntDesign();
  const mutationResetPassword = useMutation({
    mutationFn: resetPasswordService,
  });
  const mutationAdminDeleteAccount = useMutation({
    mutationFn: adminDeleteAccountService,
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmpty = account[Table_Account.Transactions].length === 0;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const resetPassword = async () => {
    await mutationResetPassword.mutateAsync(
      {
        accountId: account.id,
      },
      {
        onSuccess: (res) => {
          msgApi("success", res.data.message);
        },
        onError: (err) => {
          msgApi("error", err.response.data.message);
        },
      }
    );
  };

  const deleteAccount = () => {
    setLoading(true);
    mutationAdminDeleteAccount.mutate(
      {
        params: {
          accountId: account.id,
        },
      },
      {
        onSuccess: (axiosResponse) => {
          msgApi("success", axiosResponse.data.message);
          fetchListAccounts();
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <>
      <Button size="small" type="text" onClick={showDrawer}>
        More
      </Button>
      <Drawer
        destroyOnClose
        title={`Action on ${account[Table_Account.fullName]}'s account`}
        onClose={onClose}
        open={open}
        width={400}
      >
        <Popconfirm
          destroyTooltipOnHide
          color="#3b3b3b"
          title="Reset this account's password?"
          onConfirm={resetPassword}
        >
          <Button>Reset password</Button>
        </Popconfirm>
        <Divider orientation="left" orientationMargin={0}>
          Danger zone
        </Divider>
        <Popconfirm
          destroyTooltipOnHide
          color="#3b3b3b"
          title="Reset this account's password?"
          onConfirm={deleteAccount}
        >
          <Tooltip
            title={
              !isEmpty
                ? "This account has some books that are not returned"
                : ""
            }
          >
            <Button loading={loading} disabled={!isEmpty} danger>
              Delete this account
            </Button>
          </Tooltip>
        </Popconfirm>
      </Drawer>
    </>
  );
};
