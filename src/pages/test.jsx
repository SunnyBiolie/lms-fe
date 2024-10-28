import { testNumber1Service } from "@/services/test/number1";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [bool, setBool] = useState(false);

  const mutation = useMutation({
    mutationFn: testNumber1Service,
    onSuccess: (res) => {
      console.log(res.data);
      setBool(true);
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, []);

  console.log("bool", bool);

  return <div>abc</div>;
}
