import { NextPage } from "next";
import { useRouter } from "next/router";
import UserProfile from "../../modules/user/UserProfile";
import { trpc } from "../../utils/trpc";

const UserPage: NextPage = () => {
  const { query } = useRouter();

  const userId =
    (Array.isArray(query.userId) ? query.userId[0] : query.userId) || "";

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = trpc.user.findById.useQuery({ userId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <div>Error {JSON.stringify(error)}</div>;
  }

  return <UserProfile user={user} />;
};

export default UserPage;
