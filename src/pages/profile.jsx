import { useSearchParams } from "react-router-dom";
import { Divider, Flex, Grid, Tabs } from "antd";
import { FormChangeProfileInfo } from "@/components/tabs-profile-page/form-change-profile-info";
import { FormChangePassword } from "@/components/tabs-profile-page/form-change-pwd";
import { BtnDeleteAccount } from "@/components/tabs-profile-page/btn-delete-account";
import { useCurrentAccount } from "@/hooks/use-current-account";

const { useBreakpoint } = Grid;

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const screens = useBreakpoint();
  const { currentAccount, setCurrentAccount } = useCurrentAccount();

  const handleTabClick = (key) => {
    setSearchParams({ tab: key }, { replace: true });
  };

  const handleAfterSaveChange = (axiosResponse) => {
    setCurrentAccount(axiosResponse.data.data);
  };

  return (
    // <Tabs
    //   tabPosition={screens.lg ? "right" : "top"}
    //   size="small"
    //   defaultActiveKey={searchParams.get("tab")}
    //   onTabClick={handleTabClick}
    //   activeKey={searchParams.get("tab") || "profile"}
    //   className="section"
    //   items={[
    //     {
    //       label: "Profile",
    //       key: "profile",
    //       children: (
    //         <FormChangeProfileInfo
    //           account={currentAccount}
    //           onAfterSaveChange={handleAfterSaveChange}
    //           type="owner"
    //         />
    //       ),
    //     },
    //     {
    //       label: "Change password",
    //       key: "change-pwd",
    //       children: (
    //         <Flex justify="center">
    //           <FormChangePassword />
    //         </Flex>
    //       ),
    //     },
    //     {
    //       label: "Danger zone",
    //       key: "danger-zone",
    //       children: <BtnDeleteAccount />,
    //     },
    //   ]}
    // />
    <div className="section">
      <FormChangeProfileInfo
        account={currentAccount}
        onAfterSaveChange={handleAfterSaveChange}
        type="owner"
      />
      <Divider orientation="left">Change password</Divider>
      <FormChangePassword />
      <Divider orientation="left">Danger zone</Divider>
      <BtnDeleteAccount />
    </div>
  );
}
