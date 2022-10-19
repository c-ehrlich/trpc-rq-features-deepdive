import { trpc } from "../../../utils/trpc";
import { PostListProps } from "../PostsInfinite";

function useGetPostsPaginated(args: PostListProps) {
  return trpc.post.getPaginated.useInfiniteQuery(args.queryKey, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: args.type !== "search",
  });
}

export default useGetPostsPaginated;
