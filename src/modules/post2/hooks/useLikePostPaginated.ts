import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { PostListProps } from "../PostsInfinite";

function useLikePostPaginated(args: PostListProps) {
  const utils = trpc.useContext();
  const { data: session } = useSession();

  return trpc.post.like.useMutation({
    onMutate: async (likedPost) => {
      await utils.post.getPaginated.cancel();
      const oldData = utils.post.getPaginated.getInfiniteData(args.queryKey);
      if (oldData) {
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === likedPost.postId
                ? {
                    ...post,
                    _count: {
                      likedBy:
                        likedPost.intent === "like"
                          ? post._count.likedBy + 1
                          : post._count.likedBy - 1,
                    },
                    likedBy:
                      likedPost.intent === "like"
                        ? [{ id: session?.user?.id || "" }]
                        : [],
                  }
                : post,
            ),
          })),
        };
        utils.post.getPaginated.setInfiniteData(newData, args.queryKey);
      }
      return oldData;
    },
    onError: (err, _input, oldData) => {
      utils.post.getPaginated.setInfiniteData(oldData, args.queryKey);
      console.error(err);
    },
    onSettled: () => {
      utils.post.getPaginated.invalidate();
    },
  });
}

export default useLikePostPaginated;
