import { noImage } from "@/assets/no-imge";
import { Table_Account, Table_Book } from "@/configs/db.config";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { checkToLogOut } from "@/lib/check-to-log-out";
import { getLikedByAccIdService } from "@/services/books/get-liked-by-acc-id";
import { useQuery } from "@tanstack/react-query";
import { Flex, Image, Spin } from "antd";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { currentAccount } = useCurrentAccount();

  const { isFetching, data, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: () =>
      getLikedByAccIdService({
        params: {
          type: "owner",
          accountId: currentAccount[Table_Account.id],
        },
      }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isFetching) return <Spin className="w-full" />;
  if (error) {
    return checkToLogOut(error);
  }

  const favorites = data.data.data;

  return (
    <Flex gap={16}>
      {favorites.map((f, i) => (
        <Link key={i} to={`/book/${f[Table_Book.id]}`}>
          <Flex vertical justify="center" gap={8} className="section">
            <Image
              width={200}
              src={`${f[Table_Book.imageLink]}?tr=ar-3-4,w-200`}
              preview={false}
              fallback={noImage}
              style={{ borderRadius: "4px" }}
            />
            <p>{f[Table_Book.title]}</p>
          </Flex>
        </Link>
      ))}
    </Flex>
  );
}
