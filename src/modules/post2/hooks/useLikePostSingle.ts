import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";

type UseLikePostSingleArgs = {
  postId: string;
};

function useLikePostSingle({ postId }: UseLikePostSingleArgs) {
  const utils = trpc.useContext();
  const { data: session } = useSession();

  return trpc.post.like.useMutation({
    onMutate: async (likedPost) => {
      await utils.post.getOne.cancel();
      const oldData = utils.post.getOne.getData({ postId });
      if (oldData) {
        const newData = () => {
          if (likedPost.intent === "like") {
            return {
              ...oldData,
              _count: {
                likedBy: oldData._count.likedBy + 1,
              },
              likedBy: [{ id: session?.user?.id || "" }],
            };
          } else {
            // intent === "unlike"
            return {
              ...oldData,
              _count: {
                likedBy: oldData._count.likedBy - 1,
              },
              likedBy: [],
            };
          }
        };
        utils.post.getOne.setData(newData, { postId });
      }
      return oldData;
    },
    onError: (err, _input, oldData) => {
      utils.post.getOne.setData(oldData, { postId });
      console.error(err);
    },
    onSettled: () => utils.post.getOne.invalidate({ postId }),
  });
}

export default useLikePostSingle;
