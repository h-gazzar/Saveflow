import { z } from "zod";

import { canUseFeature } from "~/lib/planGates";
import { createTRPCRouter, enforceFeature, protectedProcedure } from "~/server/trpc";

export const leadsRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    enforceFeature(canUseFeature(ctx.user.plan, "leads"), "Lead pipeline");

    return ctx.prisma.lead.findMany({
      where: { userId: ctx.user.id },
      orderBy: [{ stage: "asc" }, { order: "asc" }, { createdAt: "desc" }]
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        company: z.string().optional(),
        stage: z.string(),
        value: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      enforceFeature(canUseFeature(ctx.user.plan, "leads"), "Lead pipeline");
      const count = await ctx.prisma.lead.count({
        where: { userId: ctx.user.id, stage: input.stage }
      });

      return ctx.prisma.lead.create({
        data: {
          userId: ctx.user.id,
          ...input,
          order: count
        }
      });
    }),
  updateStage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        stage: z.string(),
        order: z.number()
      })
    )
    .mutation(({ ctx, input }) => {
      enforceFeature(canUseFeature(ctx.user.plan, "leads"), "Lead pipeline");

      return ctx.prisma.lead.update({
        where: { id: input.id, userId: ctx.user.id },
        data: {
          stage: input.stage,
          order: input.order
        }
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        company: z.string().optional(),
        stage: z.string(),
        value: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });
      const { id, ...data } = input;

      return ctx.prisma.lead.update({
        where: { id: lead.id },
        data
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.lead.delete({
        where: { id: lead.id }
      });
    })
});
