import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import AuthedPage from "../components/AuthedPage";
import PostsInfinite from "../modules/post2/PostsInfinite";
import { authOptions } from "./api/auth/[...nextauth]";

function LikesPage() {
  const { data: session } = useSession();

  if (typeof window === "undefined" || !session?.user) return null;

  return (
    <AuthedPage>
      <PostsInfinite
        type="likes"
        queryKey={{ likedByUserId: session.user?.id }}
      />
    </AuthedPage>
  );
}

export default LikesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (!session?.user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
