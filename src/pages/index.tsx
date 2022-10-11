import type { NextPage } from "next";
import Head from "next/head";
import CreatePost from "../modules/post2/CreatePost";
import PostsInfinite from "../modules/post2/PostsInfinite";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fake Twitter</title>
        <meta name="description" content="Make posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <CreatePost />
        <PostsInfinite />
      </>
    </>
  );
};

export default Home;
