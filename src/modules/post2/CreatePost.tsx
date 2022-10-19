import React, { useState } from "react";
import useCreatePost from "./hooks/useCreatePost";

type CreatePostProps = {
  userId?: string; // for queryKey of useCreatePost
};

function CreatePost(props: CreatePostProps) {
  const [text, setText] = useState("");

  const createPostMutation = useCreatePost({ userId: props.userId });

  function createPost(e: React.FormEvent) {
    e.preventDefault();
    createPostMutation.mutate({ text });
    setText("");
  }

  return (
    <form className="flex gap-4 py-2" onSubmit={createPost}>
      <input
        className="flex-1 rounded-md bg-slate-400 p-2 placeholder-black/40"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
      />
      <div className="flex justify-end">
        <button className="rounded-full border border-slate-700 bg-blue-500 px-8 py-3 text-xl text-white hover:bg-slate-900/70">
          Submit
        </button>
      </div>
    </form>
  );
}

export default CreatePost;
