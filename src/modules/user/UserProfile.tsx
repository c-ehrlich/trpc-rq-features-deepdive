import Image from "next/future/image";
import { UserFindById } from "../../server/trpc/router/user";
import defaultAvatar from "./default-avatar.jpeg";

type UserProfileProps = { user: UserFindById["output"] };

function UserProfile(props: UserProfileProps) {
  return (
    <div className="container">
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex gap-4 bg-slate-200 p-2">
          <Image
            className="h-32 w-32 rounded-xl"
            alt={`${props.user.name}'s avatar`}
            src={props.user.image || defaultAvatar}
            width={128}
            height={128}
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{props.user.name}</h2>
            <p>Registered {props.user.createdAt.toLocaleDateString()}</p>
            <p>{props.user._count.posts} posts</p>
            <p>{props.user._count.likedPosts} likes</p>
            <p>{props.user._count.following} following</p>
            <p>{props.user._count.followedBy} followers</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
