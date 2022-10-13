import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AppRouterTypes } from "./_app";
import { constants } from "../../../utils/constants";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  create: protectedProcedure
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
  getAll: publicProcedure.query(async ({ ctx }) => {
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

  getOne: publicProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          likedBy: {
            where: {
              id: ctx.session?.user?.id ? ctx.session.user.id : "",
            },
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              likedBy: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return post;
    }),

  getPaginated: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(), // cursor should be the PK of the table
        userId: z.string().cuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
          likedBy: {
            where: {
              id: ctx.session?.user?.id ? ctx.session.user.id : "",
            },
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              likedBy: true,
            },
          },
        },
        // get an extra item at the end which we'll pop and use as next cursor
        take: constants.limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      if (!Array.isArray(posts)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting posts",
        });
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > constants.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id || "";
      }

      return { posts, nextCursor };
    }),

  like: protectedProcedure
    .input(
      z.object({
        intent: z.enum(["like", "unlike"]),
        postId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const likedPost = await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          likedBy: {
            ...(input.intent === "like" && {
              connect: {
                id: ctx.session.user.id,
              },
            }),
            ...(input.intent === "unlike" && {
              disconnect: {
                id: ctx.session.user.id,
              },
            }),
          },
        },
      });

      if (!likedPost) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return true;
    }),
});

export type PostGetPaginated = AppRouterTypes["post"]["getPaginated"];
