import { Button, Flex, Typography } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Table_Account } from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";

const { Paragraph } = Typography;

export const ActionBook = () => {
  const { currentAccount } = useCurrentAccount();

  const isAdmin = currentAccount[Table_Account.role] === "ADMIN";

  return (
    <Flex vertical className="section">
      <Paragraph strong>
        Action
      </Paragraph>
      <Flex vertical gap={12}>
        {isAdmin ? (
          <>
            <Button icon={<EditOutlined />}>Edit</Button>
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Delete
            </Button>
            {/* <Button icon={<HeartOutlined />}>Add to favorite</Button> */}
          </>
        ) : (
          "not"
        )}
      </Flex>
    </Flex>
  );
};
