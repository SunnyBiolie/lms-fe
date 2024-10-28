import { Divider, theme } from "antd";
import { FormChangeProfileInfo } from "@/components/tabs-profile-page/form-change-profile-info";
import { FormChangePassword } from "@/components/tabs-profile-page/form-change-pwd";
import { BtnDeleteAccount } from "@/components/tabs-profile-page/btn-delete-account";
import { useCurrentAccount } from "@/hooks/use-current-account";

export default function ProfilePage() {
  const { token } = theme.useToken();
  const { currentAccount, setCurrentAccount } = useCurrentAccount();

  const handleAfterSaveChange = (axiosResponse) => {
    setCurrentAccount(axiosResponse.data.data);
  };

  return (
    <div className="section">
      <Divider orientation="left">Public Profile</Divider>
      <div className="section">
        <FormChangeProfileInfo
          account={currentAccount}
          onAfterSaveChange={handleAfterSaveChange}
          type="owner"
        />
      </div>
      <Divider orientation="left">Change password</Divider>
      <FormChangePassword />
      <Divider
        orientation="left"
        style={{ borderColor: token.colorErrorBgActive, color: token.colorErrorActive }}
      >
        Danger zone
      </Divider>
      <div className="section">
        <BtnDeleteAccount />
      </div>
    </div>
  );
}
