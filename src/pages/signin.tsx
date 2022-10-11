import { GetServerSideProps } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";

function SignIn(props: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) {
  if (!props.providers) return <div>No auth providers found</div>;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-800">
      <h1 className="text-center text-4xl text-white">
        Welcome to the custom login page
      </h1>
      {Object.values(props.providers).map((provider) => (
        <button
          key={provider.id}
          className="bg-white p-2 hover:bg-slate-200"
          onClick={() => signIn(provider.id)}
        >
          Log in with {provider.name}
        </button>
      ))}
    </div>
  );
}

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
