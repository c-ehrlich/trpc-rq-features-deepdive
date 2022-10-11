import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { createContextInner } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router";
import {
  useGetPostById,
  useLikePostSingle,
} from "../../modules/post2/postHooks";
import Link from "next/link";
import Image from "next/future/image";
import { useSession } from "next-auth/react";
import defaultAvatar from "../../modules/user/default-avatar.jpeg";
import clsx from "clsx";

export default function PostPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { postId } = props;
  const { data: session } = useSession();
  const { data: post, isError, isLoading, error } = useGetPostById({ postId });

  const likePostMutation = useLikePostSingle({ postId });

  const isLiked =
    session?.user?.id && session?.user?.id === post?.likedBy[0]?.id;

  function handleLike() {
    likePostMutation.mutate({
      intent: isLiked ? "unlike" : "like",
      postId,
    });
  }

  if (isLoading) {
    console.log("loading");
    return <div className="text-white">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-white">Error: {JSON.stringify(error, null, 2)}</div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 bg-slate-900 p-8 text-white">
      <div className="flex gap-4">
        <Link href={`/user/${post.authorId}`}>
          <a>
            <Image
              className="rounded-full"
              src={post.author.image || defaultAvatar}
              alt={`${post.author.name}'s Avatar`}
              width={80}
              height={80}
            />
          </a>
        </Link>
        <Link href={`/user/${post.authorId}`}>
          <a className="text-2xl font-bold">{post.author.name}</a>
        </Link>{" "}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-4xl">{post.text}</p>
        {session?.user?.id && (
          <div className="flex items-center gap-2">
            <button
              className={clsx("pointer text-lg", isLiked && "text-red-500")}
              onClick={handleLike}
            >
              {isLiked ? "♥" : "♡"}
            </button>
            <div>{post._count.likedBy}</div>
          </div>
        )}
      </div>
      <Link href={`/post/${post.id}`}>
        <a className="text-sm text-slate-400">
          {post.createdAt.toLocaleString()}
        </a>
      </Link>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ postId: string }>,
) {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const postId = context.params?.postId as string; // mention that this _works_ but feels like lying

  const post = await ssgHelper.post.getOne.fetch({ postId });

  console.log(post);

  return {
    props: {
      trpcState: ssgHelper.dehydrate(),
      postId,
    },
  };
}
