// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Header from "../modules/header/Header";
import { useRouter } from "next/router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const showHeader = ["/signin"].indexOf(router.pathname) === -1;

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen w-screen flex-col items-center bg-slate-800">
        {showHeader && <Header />}
        <main className="container flex h-full w-screen flex-1 flex-col gap-2 ">
          <Component {...pageProps} />
        </main>
      </div>
      {/* TODO: only show this in dev */}
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
