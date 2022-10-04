import { inferProcedureOutput } from "@trpc/server";
import Image from "next/future/image";
import { AppRouter } from "../../server/trpc/router";
import defaultAvatar from "./default-avatar.jpeg";

interface PostListProps {
  posts: inferProcedureOutput<AppRouter["post"]["getAll"]>;
}

export default function PostListDisplay(props: PostListProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {props.posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

function Post(props: { post: PostListProps["posts"][number] }) {
  return (
    <div className="flex gap-2 bg-slate-900 p-2 text-white">
      <Image
        src={props.post.author.image || defaultAvatar}
        alt={`${props.post.author.name}'s Avatar`}
        width={64}
        height={64}
      />
      <div className="flex flex-col gap-2">
        <p>
          {props.post.author.name} at {props.post.createdAt.toLocaleString()}
        </p>
        <p>{props.post.text}</p>
      </div>
    </div>
  );
}
