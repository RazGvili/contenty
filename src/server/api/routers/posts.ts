import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";

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

const zGetAll = z.object({ userId: z.string() }).optional();

const getAll = publicProcedure.input(zGetAll).query(async ({ ctx, input }) => {
  const options: Prisma.PostFindManyArgs = {
    take: 100,
    orderBy: { createdAt: "desc" },
  };

  if (input?.userId) {
    options.where = { userId: input.userId };
  }

  const posts = await ctx.prisma.post.findMany(options);
  return posts;
});

const zCreate = z.object({
  description: z.string().min(1).max(100),
  link: z.string().default("").optional(),
});

const create = privateProcedure
  .input(zCreate)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId;

    const { success } = await ratelimit.limit(userId);
    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    const { profileImageUrl, username, firstName } = user;
    const userName = username || firstName || "-";

    const { description, link } = input;
    const post = await ctx.prisma.post.create({
      data: {
        userId,
        description,
        profileImageUrl,
        userName,

        // TODO: handle better
        link: link || "",
      },
    });

    return post;
  });

export const postRouter = createTRPCRouter({
  getAll,
  create,
});
