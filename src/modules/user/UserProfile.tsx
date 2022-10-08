import Image from "next/future/image";
import { trpc } from "../../utils/trpc";
import defaultAvatar from "./default-avatar.jpeg";

type UserProfileProps = { userId: string };

function UserProfile(props: UserProfileProps) {
  const {
    data: user,
    isLoading,
    isError: isErrorUser,
    error: errorUser,
  } = trpc.user.findById.useQuery({ userId: props.userId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isErrorUser) {
    return <div>Error {JSON.stringify(errorUser)}</div>;
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-4 bg-slate-200 p-2">
        <Image
          className="h-32 w-32 rounded-xl"
          alt={`${user.name}'s avatar`}
          src={user.image || defaultAvatar}
          width={128}
          height={128}
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p>Registered {user.createdAt.toLocaleDateString()}</p>
          <p>{user._count.posts} posts</p>
          <p>{user._count.likedPosts} likes</p>
          <p>{user._count.following} following</p>
          <p>{user._count.followedBy} followers</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
