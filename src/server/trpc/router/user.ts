import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AppRouterTypes } from ".";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  findById: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      console.log("in findById");
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              following: true,
              followedBy: true,
              likedPosts: true,
              posts: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return user;
    }),
});

export type UserFindById = AppRouterTypes["user"]["findById"];
