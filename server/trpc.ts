import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "~/server/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});

export function enforceLimit(args: { currentCount: number; limit: number; label: string }) {
  const { currentCount, limit, label } = args;

  if (Number.isFinite(limit) && currentCount >= limit) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Free plan limit reached for ${label}.`
    });
  }
}

export function enforceFeature(enabled: boolean, feature: string) {
  if (!enabled) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `${feature} is available on Pro and Agency plans.`
    });
  }
}
