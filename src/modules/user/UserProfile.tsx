import { useSession } from "next-auth/react";
import Image from "next/future/image";
import ErrorDisplay from "../../components/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay";
import CreatePost from "../post2/CreatePost";
import PostsInfinite from "../post2/PostsInfinite";
import defaultAvatar from "./default-avatar.jpeg";
import { useFindUserById, useFollowUser } from "./userHooks";

type UserProfileProps = { userId: string };

function UserProfile(props: UserProfileProps) {
  const { data: session } = useSession();

  const {
    data: user,
    isLoading,
    isError,
    isRefetching,
    error,
  } = useFindUserById({ userId: props.userId });

  const showFollowButton =
    session?.user?.id && session.user.id !== props.userId ? true : false;

  const isFollowing =
    session?.user?.id && session.user.id === user?.followedBy[0]?.id
      ? true
      : false;

  const followMutation = useFollowUser();

  function handleFollow() {
    followMutation.mutate({
      intent: isFollowing ? "unfollow" : "follow",
      userId: props.userId,
    });
  }

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
      <div className="mt-4 flex gap-4 bg-slate-900 p-4">
        <Image
          className="h-32 w-32 rounded-full"
          alt={`${user.name}'s avatar`}
          src={user.image || defaultAvatar}
          width={128}
          height={128}
        />
        <div className="flex flex-1 flex-col gap-1 text-white">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p>Registered {user.createdAt.toLocaleDateString()}</p>
          <p>{user._count.posts} posts</p>
          <p>{user._count.likedPosts} likes</p>
          <p>{user._count.following} following</p>
          <p>{user._count.followedBy} followers</p>
        </div>
        {showFollowButton && (
          <div>
            <button
              className="bg-slate-50 py-2 px-3 hover:bg-slate-200"
              onClick={handleFollow}
              disabled={isRefetching || followMutation.isLoading}
            >
              {(isRefetching || followMutation.isLoading) && "🔄 "}
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}
      </div>
      {props.userId === session?.user?.id && (
        <CreatePost userId={props.userId} />
      )}
      <PostsInfinite type="user" queryKey={{ userId: props.userId }} />
    </>
  );
}

export default UserProfile;
