import { useState } from "react";
import { Button } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

export const BtnToggleFavoriteBook = ({ book }) => {
  const [isLiked, setIsLiked] = useState(false);

  const Icon = isLiked ? (
    <HeartFilled style={{ color: "#fd3a36", fontSize: "16px" }} />
  ) : (
    <HeartOutlined />
  );

  const text = isLiked ? "Favorited" : "Add to favorite";

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Button icon={Icon} type="text" onClick={handleToggleLike}>
      {text}
    </Button>
  );
};
