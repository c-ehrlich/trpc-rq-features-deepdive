import { trpc } from "../../utils/trpc";

type FindUserArgs = {
  userId: string;
};

export function useFindUserById({ userId }: FindUserArgs) {
  return trpc.user.findById.useQuery(
    { userId },
    {
      retry: (_failureCount, error) => {
        if (
          error.data?.code === "NOT_FOUND" ||
          error.data?.code === "BAD_REQUEST"
        ) {
          return false;
        }
        return true;
      },
      refetchOnWindowFocus: false,
    },
  );
}

export function useFollowUser() {
  const queryClient = trpc.useContext();

  return trpc.user.follow.useMutation({
    onError: (err) => console.error(err),
    onSuccess: (_, user) => {
      queryClient.user.findById.invalidate({ userId: user.userId });
    },
  });
}
