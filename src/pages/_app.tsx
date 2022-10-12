// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Header from "../modules/header/Header";
import { useRouter } from "next/router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
      {/* only shows up in dev */}
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

function AppLayout(props: { children: ReactNode }) {
  const router = useRouter();
  const fullscreen = ["/signin"].indexOf(router.pathname) !== -1;

  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-slate-800">
      {!fullscreen && <Header />}
      <main className="container flex h-full w-screen flex-1 flex-col gap-2">
        {props.children}
      </main>
    </div>
  );
}
