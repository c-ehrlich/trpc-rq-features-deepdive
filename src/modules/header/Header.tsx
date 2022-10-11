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
      {session?.user && (
        <Link href="/likes">
          <a>Likes</a>
        </Link>
      )}
      <div>
        {session?.user ? (
          <div className="flex items-center gap-2">
            <div>Logged in as {session.user.name}</div>
            <button
              className="bg-slate-800 p-2 text-white"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="bg-slate-800 p-2 text-white"
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
