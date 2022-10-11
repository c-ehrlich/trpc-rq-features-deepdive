import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  if (!session?.user?.id) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <h1 className="text-xl text-white">
          This page is only available to logged in users
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}
