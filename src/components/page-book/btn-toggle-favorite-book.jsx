import { useEffect, useState } from "react";
import { Button } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { toggleLikeBookService } from "@/services/accounts/toggle-like-book";
import { useAntDesign } from "@/hooks/use-ant-design";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { Table_Account, Table_Book } from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useDebounce } from "@/hooks/use-debounce";
import { useFirstRender } from "@/hooks/use-first-render";

export const BtnToggleFavoriteBook = ({ book }) => {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const mutationToggleLikeBook = useMutation({
    mutationFn: toggleLikeBookService,
  });

  const [isLiked, setIsLiked] = useState(book._count[Table_Book.LikedBy] !== 0);
  const debouncedValue = useDebounce(isLiked, 500);
  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (isFirstRender) return;
    console.log("debounced", debouncedValue);
    const action = debouncedValue ? "like" : "unlike";
    toggleLikeBook(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const toggleLikeBook = (action) => {
    mutationToggleLikeBook.mutate(
      {
        accountId: currentAccount[Table_Account.id],
        bookId: book[Table_Book.id],
        action,
      },
      {
        onSuccess: (res) => {
          msgApi("success", res.data.message);
        },
        onError: (err) => {
          // Hoàn tác trạng thái nếu gặp lỗi không cập nhật db
          setIsLiked(!debouncedValue);

          msgApi("error", err.response.data.message);
          checkToLogOut(err);
        },
      }
    );
  };

  const style = isLiked ? { color: "#fd3a36" } : null;

  const Icon = isLiked ? <HeartFilled style={style} /> : <HeartOutlined />;
  const text = isLiked ? "Favorited" : "Add to favorite";

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Button icon={Icon} type="text" onClick={handleToggleLike} style={style}>
      {text}
    </Button>
  );
};
