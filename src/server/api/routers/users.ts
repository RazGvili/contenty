import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";

const zUserProfile = z.object({ userId: z.string() });

const getUserProfile = publicProcedure
  .input(zUserProfile)
  .query(async ({ input }) => {
    const userId = input.userId;

    if (!userId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const { profileImageUrl, username, firstName } = user;
    const userName = username || firstName || "-";

    const profile = {
      profileImageUrl,
      firstName,
      userName,
    };

    return profile;
  });

export const usersRouter = createTRPCRouter({
  getUserProfile,
});
