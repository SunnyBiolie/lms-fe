import { createContext, useCallback, useEffect, useState } from "react";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useMutation } from "@tanstack/react-query";
import { getBorrowingByAccountIdService } from "@/services/transaction/get-borrowing-by-account-id";
import { Table_Account, Table_Transaction } from "@/configs/db.config";
import { useAntDesign } from "@/hooks/use-ant-design";
import { getHistoriesByAccountIdService } from "@/services/histories/get-by-account-id";

export const TransactionsContext = createContext();

export default function TransactionsProvider({ children }) {
  const { msgApi } = useAntDesign();
  const { currentAccount } = useCurrentAccount();
  const mutationGetBorrowingByAccountId = useMutation({
    mutationFn: getBorrowingByAccountIdService,
  });
  const mutationGetHistoriesByAccountId = useMutation({
    mutationFn: getHistoriesByAccountIdService,
  });

  const [currentBorrowing, setCurrentBorrowing] = useState();
  const [passRequesting, setPassRequesting] = useState();
  const [isEmpty, setIsEmpty] = useState();
  const [currentReturned, setCurrentReturned] = useState();

  

  useEffect(() => {
    if (currentAccount[Table_Account.role] !== "ADMIN") {
      loadListCurrentBorrowing();
      loadListCurrentReturned();
    } else {

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadListCurrentBorrowing = useCallback(() => {
    if (!currentAccount) return;

    mutationGetBorrowingByAccountId.mutate(
      {
        params: {
          accountId: currentAccount[Table_Account.id],
        },
      },
      {
        onSuccess: (axiosResponse) => {
          const borrowing = axiosResponse.data.data.filter(
            (tran) => tran[Table_Transaction.receivedFrom] !== null
          );
          const requesting = axiosResponse.data.data.filter(
            (tran) => tran[Table_Transaction.receivedFrom] === null
          );
          setCurrentBorrowing(borrowing);
          setPassRequesting(requesting);
          setIsEmpty(axiosResponse.data.data.length === 0);
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, msgApi]);

  const loadListCurrentReturned = useCallback(() => {
    if (!currentAccount) return;

    mutationGetHistoriesByAccountId.mutate(
      {
        params: {
          accountId: currentAccount.id,
        },
      },
      {
        onSuccess: (axiosResponse) => {
          setCurrentReturned(axiosResponse.data.data);
        },
        onError: (axiosError) => {
          msgApi("error", axiosError.response.data.message);
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, msgApi]);

  if (!currentAccount) return;

  const contextValues = {
    currentBorrowing,
    passRequesting,
    isEmpty,
    currentReturned,
    loadListCurrentBorrowing,
    loadListCurrentReturned,
  };

  return (
    <TransactionsContext.Provider value={contextValues}>
      {children}
    </TransactionsContext.Provider>
  );
}
