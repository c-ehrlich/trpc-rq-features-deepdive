import Image from "next/future/image";
import Link from "next/link";
import { PostGetPaginated } from "../../server/trpc/router/post";
import defaultAvatar from "../user/default-avatar.jpeg";

// TODO: maybe incorporate this instead
interface PostListProps {
  // using inference helpers, see:
  // https://trpc.io/docs/v10/infer-types#additional-dx-helper-type
  posts: PostGetPaginated["output"]["posts"];

  // Another way to do this without inference helpers:
  // posts: inferProcedureOutput<AppRouter["post"]["getPaginated"]>["posts"];
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
      <Link href={`/user/${props.post.authorId}`}>
        <a>
          <Image
            src={props.post.author.image || defaultAvatar}
            alt={`${props.post.author.name}'s Avatar`}
            width={64}
            height={64}
          />
        </a>
      </Link>
      <div className="flex flex-col gap-2">
        <p>
          <Link href={`/user/${props.post.authorId}`}>
            <a>{props.post.author.name}</a>
          </Link>{" "}
          at {props.post.createdAt.toLocaleString()}
        </p>
        <p>{props.post.text}</p>
      </div>
    </div>
  );
}
