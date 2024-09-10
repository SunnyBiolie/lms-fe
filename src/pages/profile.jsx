import { Flex, Tabs } from "antd";
import { FormChangeProfile } from "@/components/tabs-profile-page/form-change-profile";
import { FormChangePassword } from "@/components/tabs-profile-page/form-change-pwd";
import { BtnDeleteAccount } from "@/components/tabs-profile-page/btn-delete-account";

export default function ProfilePage() {
  return (
    <Tabs
      items={[
        {
          label: "Profile",
          key: "profile",
          children: (
            <Flex justify="center">
              <FormChangeProfile />
            </Flex>
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
          label: "Danger",
          key: "danger",
          children: <BtnDeleteAccount />,
        },
      ]}
    />
  );
}
