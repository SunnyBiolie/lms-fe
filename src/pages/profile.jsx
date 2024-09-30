import { Col, Flex, Row, Tabs } from "antd";
import { FormChangeProfile } from "@/components/tabs-profile-page/form-change-profile";
import { FormChangePassword } from "@/components/tabs-profile-page/form-change-pwd";
import { BtnDeleteAccount } from "@/components/tabs-profile-page/btn-delete-account";
import { useSearchParams } from "react-router-dom";
import { useCurrentAccount } from "@/hooks/use-current-account";

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { currentAccount, setCurrentAccount } = useCurrentAccount();

  const handleTabClick = (key) => {
    setSearchParams({ tab: key }, { replace: true });
  };

  const handleAfterSaveChange = (axiosResponse) => {
    setCurrentAccount(axiosResponse.data.data);
  };

  return (
    <Tabs
      defaultActiveKey={searchParams.get("tab")}
      onTabClick={handleTabClick}
      activeKey={searchParams.get("tab") || "profile"}
      className="section"
      items={[
        {
          label: "Profile",
          key: "profile",
          children: (
            <Row gutter={28}>
              <Col span={12}>
                
              </Col>
              <Col span={12}>
                <FormChangeProfile
                  account={currentAccount}
                  onAfterSaveChange={handleAfterSaveChange}
                />
              </Col>
            </Row>
          ),
        },
        {
          label: "Change password",
          key: "change-pwd",
          children: (
            <Flex justify="center">
              <FormChangePassword />
            </Flex>
          ),
        },
        {
          label: "Danger zone",
          key: "danger-zone",
          children: <BtnDeleteAccount />,
        },
      ]}
    />
  );
}
