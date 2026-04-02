import { z } from "zod";

import { canUseFeature } from "~/lib/planGates";
import { createTRPCRouter, enforceFeature, protectedProcedure } from "~/server/trpc";

export const timeRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    enforceFeature(canUseFeature(ctx.user.plan, "time"), "Time tracking");

    return ctx.prisma.timeEntry.findMany({
      where: { userId: ctx.user.id },
      include: { project: true },
      orderBy: { createdAt: "desc" }
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        hours: z.number().positive(),
        rate: z.number().positive()
      })
    )
    .mutation(({ ctx, input }) => {
      enforceFeature(canUseFeature(ctx.user.plan, "time"), "Time tracking");

      return ctx.prisma.timeEntry.create({
        data: {
          userId: ctx.user.id,
          ...input
        }
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        projectId: z.string(),
        hours: z.number().positive(),
        rate: z.number().positive()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.prisma.timeEntry.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });
      const { id, ...data } = input;

      return ctx.prisma.timeEntry.update({
        where: { id: entry.id },
        data
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.prisma.timeEntry.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.timeEntry.delete({
        where: { id: entry.id }
      });
    })
});
