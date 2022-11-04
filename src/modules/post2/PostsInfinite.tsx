import { PostGetPaginatedOutput } from "../../server/trpc/router/post";
import useGetPostsPaginated from "./hooks/useGetPostsPaginated";
import useLikePostPaginated from "./hooks/useLikePostPaginated";
import defaultAvatar from "../user/default-avatar.jpeg";
import Image from "next/image";
import Link from "next/link";
import GetMorePostsButton from "./GetMorePostsButton";
import ErrorDisplay from "../../components/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay";
import { useSession } from "next-auth/react";
import { clsx } from "clsx";
import { ReactNode } from "react";

export type PostListProps =
  | {
      type: "timeline";
      queryKey: Record<string, never>;
    }
  | {
      type: "user";
      queryKey: { userId: string };
    }
  | {
      type: "search";
      queryKey: { text: string };
    }
  | {
      type: "likes";
      queryKey: { likedByUserId: string };
    };

function PostsInfinite(props: PostListProps) {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    fetchStatus,
  } = useGetPostsPaginated(props);

  if (isLoading) {
    return <LoadingDisplay thing="posts" />;
  }

  if (isError) {
    return <ErrorDisplay error={JSON.stringify(error)} />;
  }

  return (
    <>
      <PostsInfiniteListUI>
        {posts?.pages.map((page, index) => (
          <PostInifiniteListGroup key={`page-${index}`}>
            {page.posts.map((post) => (
              <PostInList key={post.id} post={post} queryOptions={props} />
            ))}
          </PostInifiniteListGroup>
        ))}
      </PostsInfiniteListUI>
      <GetMorePostsButton
        hasNextPage={hasNextPage || false}
        fetchNextPage={fetchNextPage}
        fetchStatus={fetchStatus}
      />
    </>
  );
}

export default PostsInfinite;

export function PostsInfiniteListUI(props: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{props.children}</div>;
}

export function PostInifiniteListGroup(props: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{props.children}</div>;
}

export function PostInList(props: {
  post: PostGetPaginatedOutput["posts"][number];
  queryOptions: PostListProps;
}) {
  const { data: session } = useSession();

  const likePostMutation = useLikePostPaginated(props.queryOptions);

  const isLiked =
    session?.user?.id && session?.user?.id === props.post.likedBy[0]?.id;

  function handleLike() {
    likePostMutation.mutate({
      intent: isLiked ? "unlike" : "like",
      postId: props.post.id,
    });
  }

  return (
    <div className="flex gap-2 bg-slate-900 p-4 text-white">
      <Link href={`/user/${props.post.authorId}`}>
        <Image
          className="rounded-full"
          src={props.post.author.image || defaultAvatar}
          alt={`${props.post.author.name}'s Avatar`}
          width={64}
          height={64}
        />
      </Link>
      <div className="flex flex-col gap-2">
        <p>
          <Link href={`/user/${props.post.authorId}`}>
            {props.post.author.name}
          </Link>{" "}
          at{" "}
          <Link href={`/post/${props.post.id}`}>
            {props.post.createdAt.toLocaleString()}
          </Link>
        </p>
        <p>{props.post.text}</p>
        {session?.user?.id && (
          <div className="flex items-center gap-2">
            <button
              className={clsx("pointer text-lg", isLiked && "text-red-500")}
              onClick={handleLike}
            >
              {isLiked ? "♥" : "♡"}
            </button>
            <div>{props.post._count.likedBy}</div>
          </div>
        )}
      </div>
    </div>
  );
}
