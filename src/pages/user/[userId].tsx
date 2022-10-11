import { NextPage } from "next";
import { useRouter } from "next/router";
import LoadingDisplay from "../../components/LoadingDisplay";
import UserProfile from "../../modules/user/UserProfile";

const UserPage: NextPage = () => {
  const { query } = useRouter();

  const userId =
    (Array.isArray(query.userId) ? query.userId[0] : query.userId) || "";

  if (!userId) {
    return <LoadingDisplay thing="user" />;
  }

  return <UserProfile userId={userId} />;
};

export default UserPage;
