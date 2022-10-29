import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { RouterTypes } from "../../../utils/trpc";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  findById: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
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
          followedBy: {
            where: {
              id: ctx.session?.user?.id,
            },
            select: {
              id: true,
            },
          },
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

  follow: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        intent: z.enum(["follow", "unfollow"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const followedUser = await prisma?.user.update({
        where: {
          id: input.userId,
        },
        data: {
          followedBy: {
            ...(input.intent === "follow" && {
              connect: {
                id: ctx.session.user.id,
              },
            }),
            ...(input.intent === "unfollow" && {
              disconnect: {
                id: ctx.session.user.id,
              },
            }),
          },
        },
      });

      if (!followedUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return true;
    }),
});

export type UserFindById = RouterTypes["user"]["findById"];
