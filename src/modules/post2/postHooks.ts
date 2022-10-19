import { useSession } from "next-auth/react";
import { PostGetPaginated } from "../../server/trpc/router/post";
import { trpc } from "../../utils/trpc";
import { PostListProps } from "./PostsInfinite";

type CreatePostArgs = {
  userId: string;
};

export function useCreatePost({ userId }: CreatePostArgs) {
  const { data: session } = useSession();
  const queryClient = trpc.useContext();

  return trpc.post.create.useMutation({
    onMutate: (post) => {
      queryClient.post.getPaginated.cancel();
      const oldData = queryClient.post.getPaginated.getInfiniteData({
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

        queryClient.post.getPaginated.setInfiniteData(oldData, {
          userId,
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
}

type UseGetPostByIdArgs = {
  postId: string;
};

export function useGetPostById({ postId }: UseGetPostByIdArgs) {
  return trpc.post.getOne.useQuery({ postId });
}

export function useGetPostsPaginated(args: PostListProps) {
  return trpc.post.getPaginated.useInfiniteQuery(args.queryKey, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: args.type !== "search",
  });
}

type UseLikePostSingleArgs = {
  postId: string;
};

export function useLikePostSingle(args: UseLikePostSingleArgs) {
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  return trpc.post.like.useMutation({
    onError: (err) => console.error(err),
    onMutate: async (likedPost) => {
      await queryClient.post.getOne.cancel();
      queryClient.post.getOne.setData((oldData) => {
        if (!oldData) return;
        if (likedPost.intent === "like") {
          return {
            ...oldData,
            _count: {
              likedBy: oldData._count.likedBy + 1,
            },
            likedBy: [{ id: session?.user?.id || "" }],
          };
        } else {
          return {
            ...oldData,
            _count: {
              likedBy: oldData._count.likedBy - 1,
            },
            likedBy: [],
          };
        }
      }, args);
    },
    onSettled: () =>
      queryClient.post.getOne.invalidate({ postId: args.postId }),
  });
}

export function useLikePostPaginated(args: PostListProps) {
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  return trpc.post.like.useMutation({
    onError: (err) => console.error(err),
    onMutate: async (likedPost) => {
      await queryClient.post.getPaginated.cancel();
      queryClient.post.getPaginated.setInfiniteData((oldData) => {
        if (!oldData) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
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
        // TODO: create a post in ts-wizards discord about a better way to implement this
      }, args.queryKey);
    },

    onSettled: () => {
      queryClient.post.getPaginated.invalidate();
    },
  });
}
