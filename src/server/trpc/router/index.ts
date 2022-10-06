// src/server/trpc/router/index.ts
import { GetInferenceHelpers } from "@trpc/server";
import { t } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = t.router({
  auth: authRouter,
  post: postRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type AppRouterTypes = GetInferenceHelpers<AppRouter>;
