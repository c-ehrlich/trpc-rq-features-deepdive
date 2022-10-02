import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

function CreatePost() {
  const [text, setText] = useState("");

  const createPostMutation = trpc.post.create.useMutation();

  function createPost(e: React.FormEvent) {
    e.preventDefault();
    createPostMutation.mutate(
      { text },
      {
        onError: (e) => console.error(e),
      },
    );
  }

  return (
    <form className="flex flex-col gap-2 p-2" onSubmit={createPost}>
      <textarea
        className="p-2"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <button className="bg-slate-50 px-3 py-2 text-xl hover:bg-slate-100">
          Submit
        </button>
      </div>
    </form>
  );
}

export default CreatePost;
