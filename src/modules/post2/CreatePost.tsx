import React, { useState } from "react";
import { useCreatePost } from "./postHooks";

type CreatePostProps = {
  userId: string;
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
