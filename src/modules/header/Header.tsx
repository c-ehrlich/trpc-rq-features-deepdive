import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 mb-4 flex w-screen items-center justify-between border-b-2 border-b-slate-500 bg-slate-900 p-4 text-white">
      <Link href="/">
        <h1 className="text-2xl text-white">Fake Twitter</h1>
      </Link>
      {session?.user && (
        <>
          <Link href="/likes">Likes</Link>
          <Link href="/search">Search</Link>
        </>
      )}
      <div>
        {session?.user ? (
          <div className="flex items-center gap-4">
            <div>Logged in as {session.user.name}</div>
            <button className="bg-slate-700 p-2" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="bg-slate-700 p-2" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
