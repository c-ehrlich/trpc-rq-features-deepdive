import { trpc } from "../../utils/trpc";
import PostListDisplay from "./PostListDisplay";

function PostList() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = trpc.post.getAll.useQuery();

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <PostListDisplay posts={posts} />
    </div>
  );
}

export default PostList;
