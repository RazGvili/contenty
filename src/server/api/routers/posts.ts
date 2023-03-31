import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

// Create a new ratelimiter, that allows 5 requests per 1 m
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

const getAll = publicProcedure.query(async ({ ctx }) => {
  const posts = await ctx.prisma.post.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  return posts;
});

const zCreate = z.object({ content: z.string().min(1).max(280) });

const create = privateProcedure
  .input(zCreate)
  .mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId;

    const { success } = await ratelimit.limit(authorId);
    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }

    const { content } = input;

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content,
      },
    });

    return post;
  });

export const postRouter = createTRPCRouter({
  getAll,
  create,
});
