import { useSession } from "next-auth/react";
import { PostGetPaginated } from "../../../server/trpc/router/post";
import { trpc } from "../../../utils/trpc";

type CreatePostArgs = {
  userId?: string;
};

function useCreatePost({ userId }: CreatePostArgs) {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  return trpc.post.create.useMutation({
    onMutate: (post) => {
      utils.post.getPaginated.cancel();
      const oldData = utils.post.getPaginated.getInfiniteData({
        userId,
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

        utils.post.getPaginated.setInfiniteData(oldData, {
          userId,
        });
      }
      return oldData;
    },
    onError: (e, _input, oldData) => {
      utils.post.getPaginated.setInfiniteData(oldData);
      console.error(e);
    },
    onSettled: () => utils.post.getPaginated.invalidate(),
  });
}

export default useCreatePost;
