import { constants } from "../../utils/constants";
import { trpc } from "../../utils/trpc";

type UseGetPostsArgs = {
  userId?: string;
};

export function useGetPostsPaginated(args: UseGetPostsArgs) {
  return trpc.post.getPaginated.useInfiniteQuery(
    {
      limit: constants.limit,
      ...(args.userId && { userId: args.userId }),
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
}
