import { z } from "zod";

import { getPlanLimit } from "~/lib/planGates";
import { createTRPCRouter, enforceLimit, protectedProcedure } from "~/server/trpc";

export const clientsRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.client.findMany({
      where: { userId: ctx.user.id },
      include: {
        _count: {
          select: { projects: true }
        },
        invoices: {
          select: { amount: true, status: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  ),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        company: z.string().optional(),
        notes: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.prisma.client.count({ where: { userId: ctx.user.id } });
      enforceLimit({
        currentCount: count,
        limit: getPlanLimit(ctx.user.plan, "clients"),
        label: "clients"
      });

      return ctx.prisma.client.create({
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
        name: z.string().min(2),
        email: z.string().email(),
        company: z.string().optional(),
        notes: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const client = await ctx.prisma.client.findFirstOrThrow({
        where: { id, userId: ctx.user.id }
      });

      return ctx.prisma.client.update({
        where: { id: client.id },
        data
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.prisma.client.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.client.delete({
        where: { id: client.id }
      });
    })
});
