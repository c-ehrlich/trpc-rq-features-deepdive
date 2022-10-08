import { NextPage } from "next";
import { useRouter } from "next/router";
import UserProfile from "../../modules/user/UserProfile";

const UserPage: NextPage = () => {
  const { query } = useRouter();

  const userId =
    (Array.isArray(query.userId) ? query.userId[0] : query.userId) || "";

  return <UserProfile userId={userId} />;
};

export default UserPage;
