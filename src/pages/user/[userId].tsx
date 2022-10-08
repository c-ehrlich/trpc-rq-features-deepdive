import { NextPage } from "next";
import { useRouter } from "next/router";
import UserProfile from "../../modules/user/UserProfile";
import { useSession } from "next-auth/react";
import CreatePost from "../../modules/post2/CreatePost";
import PostsInfinite from "../../modules/post2/PostsInfinite";

const UserPage: NextPage = () => {
  const { query } = useRouter();
  const { data: session } = useSession();

  const userId =
    (Array.isArray(query.userId) ? query.userId[0] : query.userId) || "";

  return (
    <>
      <UserProfile userId={userId} />
      {userId === session?.user?.id && <CreatePost />}
      <PostsInfinite userId={userId} />
    </>
  );
};

export default UserPage;
