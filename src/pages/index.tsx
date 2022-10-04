import type { NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import PostList from "../modules/post/PostList";
import CreatePost from "../modules/post/CreatePost";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Fake Twitter</title>
        <meta name="description" content="Make posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session?.user?.id ? (
        <LoggedInView />
      ) : (
        <div className="flex h-full w-screen flex-1 flex-col items-center justify-center">
          <h1 className="text-xl text-white">
            Please sign in to start using Fake Twitter
          </h1>
        </div>
      )}
    </>
  );
};

export default Home;

function LoggedInView() {
  return (
    <>
      <CreatePost />
      <PostList />
    </>
  );
}
