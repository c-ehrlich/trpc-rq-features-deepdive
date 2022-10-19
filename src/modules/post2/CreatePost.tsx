import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { PostGetPaginated } from "../../server/trpc/router/post";
import { trpc } from "../../utils/trpc";

type CreatePostProps = {
  userId?: string;
};

function CreatePost(props: CreatePostProps) {
  const [text, setText] = useState("");
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  const createPostMutation = trpc.post.create.useMutation({
    onMutate: (post) => {
      queryClient.post.getPaginated.cancel();
      const oldData = queryClient.post.getPaginated.getInfiniteData({
        userId: props.userId,
      });
      if (oldData) {
        const date = new Date();
        // leaving here for tutorial sake but would usually delete the type
        // after building the object
        const newPost: PostGetPaginated["output"]["posts"][number] = {
          id: JSON.stringify(date),
          text: post.text,
          createdAt: date,
          updatedAt: date,
          authorId: session?.user?.id || "",
          likedBy: [],
          author: {
            name: session?.user?.name || "unknown username",
            image: session?.user?.image || "",
          },
          _count: {
            likedBy: 0,
          },
        };

        if (oldData.pages[0]) {
          oldData.pages[0].posts.unshift(newPost);
        }

        queryClient.post.getPaginated.setInfiniteData(oldData, {
          userId: props.userId,
        });
      }
      return oldData;
    },
    onError: (e, _input, oldData) => {
      queryClient.post.getPaginated.setInfiniteData(oldData);
      console.error(e);
    },
    onSettled: () => queryClient.post.getPaginated.invalidate(),
  });

  function createPost(e: React.FormEvent) {
    e.preventDefault();
    createPostMutation.mutate({ text });
    setText("");
  }

  return (
    <form className="flex gap-4 py-2" onSubmit={createPost}>
      <input
        className="flex-1 rounded-md p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
      />
      <div className="flex justify-end">
        <button className="rounded-full bg-slate-50 px-5 py-2 text-xl hover:bg-slate-100">
          Submit
        </button>
      </div>
    </form>
  );
}

export default CreatePost;
