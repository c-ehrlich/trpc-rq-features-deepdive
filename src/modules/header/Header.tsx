import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 flex w-screen items-center justify-between border-b-2 bg-slate-100 p-4">
      <Link href="/">
        <a>
          <h1 className="text-2xl text-black">Fake Twitter</h1>
        </a>
      </Link>
      <div>
        {session?.user ? (
          <div className="flex gap-2 items-center">
            <div>Logged in as {session.user.name}</div>
            <button
              className="p-2 bg-slate-800 text-white"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="p-2 bg-slate-800 text-white"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
