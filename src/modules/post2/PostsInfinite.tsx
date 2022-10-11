import { PostGetPaginated } from "../../server/trpc/router/post";
import { useGetPostsPaginated } from "./postHooks";
import defaultAvatar from "../user/default-avatar.jpeg";
import Image from "next/future/image";
import Link from "next/link";
import GetMorePostsButton from "./GetMorePostsButton";
import ErrorDisplay from "../../components/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay";
import { useSession } from "next-auth/react";
import { clsx } from "clsx";
import { trpc } from "../../utils/trpc";

type PostFetcherProps = {
  userId?: string;
};

function PostsInfinite(props: PostFetcherProps) {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    fetchStatus,
  } = useGetPostsPaginated(props);

  if (isLoading) return <LoadingDisplay thing="posts" />;

  if (isError || !posts) return <ErrorDisplay error={JSON.stringify(error)} />;

  return (
    <>
      <div className="flex flex-col gap-2">
        {posts.pages.map((page, index) => (
          <div key={`page-${index}`} className="flex flex-col gap-2">
            {page.posts.map((post) => (
              <PostInList key={post.id} post={post} queryKey={props} />
            ))}
          </div>
        ))}
      </div>
      <GetMorePostsButton
        hasNextPage={hasNextPage || false}
        fetchNextPage={fetchNextPage}
        fetchStatus={fetchStatus}
      />
    </>
  );
}

export default PostsInfinite;

function PostInList(props: {
  post: PostGetPaginated["output"]["posts"][number];
  queryKey: PostFetcherProps;
}) {
  const { data: session } = useSession();
  const queryClient = trpc.useContext();

  const likePostMutation = trpc.post.like.useMutation({
    onError: (err) => console.error(err),
    onMutate: async (likedPost) => {
      await queryClient.post.getPaginated.cancel();
      queryClient.post.getPaginated.setInfiniteData((data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        const thingToReturn = {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === likedPost.postId
                ? {
                    ...post,
                    _count: {
                      likedBy:
                        likedPost.intent === "like"
                          ? post._count.likedBy + 1
                          : post._count.likedBy - 1,
                    },
                    likedBy:
                      likedPost.intent === "like"
                        ? // DONT PUT THE "" FIRST AND "DEBUG" IT
                          [{ id: session?.user?.id || "" }]
                        : [],
                  }
                : post,
            ),
          })),
        };
        return thingToReturn;
      }, props.queryKey);
    },

    onSettled: () => queryClient.post.getPaginated.invalidate(),
  });

  const isLiked =
    session?.user?.id && session?.user?.id === props.post.likedBy[0]?.id;

  function handleLike() {
    likePostMutation.mutate({
      intent: isLiked ? "unlike" : "like",
      postId: props.post.id,
    });
  }

  return (
    <div className="flex gap-2 bg-slate-900 p-2 text-white">
      <Link href={`/user/${props.post.authorId}`}>
        <a>
          <Image
            src={props.post.author.image || defaultAvatar}
            alt={`${props.post.author.name}'s Avatar`}
            width={64}
            height={64}
          />
        </a>
      </Link>
      <div className="flex flex-col gap-2">
        <p>
          <Link href={`/user/${props.post.authorId}`}>
            <a>{props.post.author.name}</a>
          </Link>{" "}
          at{" "}
          <Link href={`/post/${props.post.id}`}>
            <a>{props.post.createdAt.toLocaleString()}</a>
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
