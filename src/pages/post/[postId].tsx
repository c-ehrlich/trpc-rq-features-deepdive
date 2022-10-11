import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { createContextInner } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router";
import { useGetPostById } from "../../modules/post2/postHooks";

export default function PostPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { postId } = props;
  const { data: post, isError, isLoading, error } = useGetPostById({ postId });

  if (isLoading) {
    console.log("loading");
    return <div className="text-white">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-white">Error: {JSON.stringify(error, null, 2)}</div>
    );
  }

  return <pre className="text-white">{JSON.stringify(post, null, 2)}</pre>;
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
