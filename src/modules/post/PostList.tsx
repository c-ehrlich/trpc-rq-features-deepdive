import { constants } from "../../utils/constants";
import { trpc } from "../../utils/trpc";
import PostListDisplay from "./PostListDisplay";

function PostList() {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage } =
    trpc.post.getPaginated.useInfiniteQuery(
      { limit: constants.limit },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <PostListDisplay posts={data.pages.map((p) => p.posts).flat()} />
      <button
        className="bg-slate-200 px-3 py-2"
        disabled={!hasNextPage}
        onClick={() => fetchNextPage()}
      >
        {hasNextPage ? "Next Page" : "(no more pages)"}
      </button>
    </div>
  );
}

export default PostList;
