import { PostGetPaginated } from "../../server/trpc/router/post";
import { useGetPostsPaginated } from "./postHooks";
import defaultAvatar from "../user/default-avatar.jpeg";
import Image from "next/future/image";
import Link from "next/link";
import GetMorePostsButton from "./GetMorePostsButton";
import ErrorDisplay from "../../components/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay";

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
      <PostList posts={posts.pages.flatMap((p) => p.posts)} />
      <GetMorePostsButton
        hasNextPage={hasNextPage || false}
        fetchNextPage={fetchNextPage}
        fetchStatus={fetchStatus}
      />
    </>
  );
}

export default PostsInfinite;

type PostListProps = {
  // using inference helpers, see:
  // https://trpc.io/docs/v10/infer-types#additional-dx-helper-type
  posts: PostGetPaginated["output"]["posts"];

  // Another way to do this without inference helpers:
  // posts: inferProcedureOutput<AppRouter["post"]["getPaginated"]>["posts"];
};

function PostList(props: PostListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 py-2">
        {props.posts.map((post) => (
          <PostInList key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostInList(props: { post: PostListProps["posts"][number] }) {
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
          at {props.post.createdAt.toLocaleString()}
        </p>
        <p>{props.post.text}</p>
      </div>
    </div>
  );
}
