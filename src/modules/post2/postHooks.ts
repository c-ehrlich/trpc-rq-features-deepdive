import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { PostFetcherProps } from "./PostsInfinite";

type UseGetPostsArgs = {
  userId?: string;
};

export function useGetPostsPaginated(args: UseGetPostsArgs) {
  return trpc.post.getPaginated.useInfiniteQuery(
    {
      ...(args.userId && { userId: args.userId }),
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
}

type UseLikePostArgs = {
  queryKey: PostFetcherProps;
};

export function useLikePost({ queryKey }: UseLikePostArgs) {
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  return trpc.post.like.useMutation({
    onError: (err) => console.error(err),
    onMutate: async (likedPost) => {
      await queryClient.post.getPaginated.cancel();
      queryClient.post.getPaginated.setInfiniteData((data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...data,
          pages: data.pages.map((page) => ({
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
                        ? // DONT PUT THE "" FIRST AND "DEBUG" IT
                          [{ id: session?.user?.id || "" }]
                        : [],
                  }
                : post,
            ),
          })),
        };
      }, queryKey);
    },

    onSettled: () => queryClient.post.getPaginated.invalidate(),
  });
}
