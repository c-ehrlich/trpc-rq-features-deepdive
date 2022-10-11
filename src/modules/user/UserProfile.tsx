import { useSession } from "next-auth/react";
import Image from "next/future/image";
import ErrorDisplay from "../../components/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay";
import { trpc } from "../../utils/trpc";
import CreatePost from "../post2/CreatePost";
import PostsInfinite from "../post2/PostsInfinite";
import defaultAvatar from "./default-avatar.jpeg";

type UserProfileProps = { userId: string };

function UserProfile(props: UserProfileProps) {
  const { data: session } = useSession();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = trpc.user.findById.useQuery(
    { userId: props.userId },
    {
      retry: (_failureCount, error) => {
        if (
          error.data?.code === "NOT_FOUND" ||
          error.data?.code === "BAD_REQUEST"
        ) {
          return false;
        }
        return true;
      },
    },
  );

  if (isLoading) {
    return <LoadingDisplay thing="user" />;
  }

  if (
    error?.data?.code === "NOT_FOUND" ||
    error?.data?.code === "BAD_REQUEST"
  ) {
    return <ErrorDisplay error="User does not exist" />;
  }

  if (isError) {
    return <ErrorDisplay error={JSON.stringify(error)} />;
  }

  return (
    <>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex gap-4 bg-slate-900 p-2">
          <Image
            className="h-32 w-32 rounded-xl"
            alt={`${user.name}'s avatar`}
            src={user.image || defaultAvatar}
            width={128}
            height={128}
          />
          <div className="flex flex-col gap-1 text-white">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p>Registered {user.createdAt.toLocaleDateString()}</p>
            <p>{user._count.posts} posts</p>
            <p>{user._count.likedPosts} likes</p>
            <p>{user._count.following} following</p>
            <p>{user._count.followedBy} followers</p>
          </div>
        </div>
      </div>
      {props.userId === session?.user?.id && (
        <CreatePost userId={props.userId} />
      )}
      <PostsInfinite type="user" queryKey={{ userId: props.userId }} />
    </>
  );
}

export default UserProfile;
