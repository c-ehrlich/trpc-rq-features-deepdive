import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AppRouterTypes } from ".";
import { constants } from "../../../utils/constants";
import { authedProcedure, t } from "../trpc";

export const postRouter = t.router({
  create: authedProcedure
    .input(z.object({ text: z.string().min(1).max(140) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating post",
        });
      }

      return true;
    }),

  // NOT USING THIS ANYMORE
  getAll: t.procedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!Array.isArray(posts)) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting posts",
      });
    }

    return posts;
  }),

  getPaginated: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // cursor should be the PK of the table
        userId: z.string().cuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? constants.limit;
      const { cursor } = input;

      const posts = await ctx.prisma.post.findMany({
        where: {
          ...(input.userId && { authorId: input.userId }),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        // get an extra item at the end which we'll pop and use as next cursor
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      if (!Array.isArray(posts)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting posts",
        });
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id || "";
      }

      return { posts, nextCursor };
    }),
});

export type PostGetPaginated = AppRouterTypes["post"]["getPaginated"];
