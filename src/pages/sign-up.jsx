import { useState } from "react";
import { Link } from "react-router-dom";
import { Flex, Steps } from "antd";
import { createStyles } from "antd-style";
import { routeAuth } from "@/configs/route.config";
import { FormUserInfor } from "@/components/form-user-infor";
import { FormSighUp } from "@/components/form-sign-up";

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles(({ _, css }) => ({
  container: css`
    width: 50vw;
    min-width: 352px;
    max-width: 600px;
    height: 100%;
    margin: 0 auto;
  `,
  steps: css`
    width: 100%;
    padding-top: 32px;
    padding-bottom: 32px;
  `,
  content: css`
    flex-grow: 1;
    display: flex;
    justify-content: center;
  `,
  footer: css`
    font-size: 14px;
    padding: 32px 0;
    & > a {
      &:hover {
        text-decoration: underline;
      }
    };
  `,
}));

const signUpSteps = [
  {
    key: 1,
    title: "Your information",
  },
  {
    key: 2,
    title: "Create an account",
  },
];

export default function SignUpPage() {
  const { styles } = useStyles();

  const [currentStep, setCurrentStep] = useState(0);
  const [userInfor, setUserInfor] = useState();

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Flex vertical align="center" className={styles.container}>
      <Steps
        current={currentStep}
        items={signUpSteps}
        className={styles.steps}
      />
      <div className={styles.content}>
        <div style={{ width: "100%" }}>
          {signUpSteps[currentStep].key === 1 ? (
            <FormUserInfor nextStep={nextStep} userInfor={userInfor} setUserInfor={setUserInfor} />
          ) : (
            <FormSighUp prevStep={prevStep} userInfor={userInfor} />
          )}
        </div>
      </div>
      <div className={styles.footer}>
        Already have an account? Log in{" "}
        <Link to={routeAuth.logIn.pathname}>here</Link>
      </div>
    </Flex>
  );
}
