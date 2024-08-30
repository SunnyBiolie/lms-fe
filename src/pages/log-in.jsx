import { Flex, Typography } from "antd";
import { createStyles } from "antd-style";
import { FormLogIn } from "@/components/form-log-in";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    width: 50vw;
    min-width: 352px;
    max-width: 600px;
    height: 100%;
    margin: 0 auto;
  `,
}));

export default function LogInPage() {
  const { styles } = useStyles();

  return (
    <Flex vertical justify="center" align="center" gap={16} className={styles.container}>
      <Typography.Title
        style={{
          fontSize: "24px",
          color: "#f1f1f1",
          textShadow: "2px 2px #8462e96c",
        }}
      >
        Library Management System
      </Typography.Title>
      <Flex style={{ width: "100%" }}>
        <FormLogIn />
      </Flex>
    </Flex>
  );
}
