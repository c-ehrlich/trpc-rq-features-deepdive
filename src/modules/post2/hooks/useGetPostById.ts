import { trpc } from "../../../utils/trpc";

type UseGetPostByIdArgs = {
  postId: string;
};

function useGetPostById({ postId }: UseGetPostByIdArgs) {
  return trpc.post.getOne.useQuery({ postId });
}

export default useGetPostById;
