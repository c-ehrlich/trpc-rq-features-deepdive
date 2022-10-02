import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
});
