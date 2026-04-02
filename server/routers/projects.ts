import { z } from "zod";

import { getPlanLimit } from "~/lib/planGates";
import { createTRPCRouter, enforceLimit, protectedProcedure } from "~/server/trpc";

export const projectsRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.project.findMany({
      where: { userId: ctx.user.id },
      include: { client: true, timeEntries: true },
      orderBy: { createdAt: "desc" }
    })
  ),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        clientId: z.string(),
        status: z.string(),
        deadline: z.string().optional(),
        paymentStatus: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.prisma.project.count({ where: { userId: ctx.user.id } });
      enforceLimit({
        currentCount: count,
        limit: getPlanLimit(ctx.user.plan, "projects"),
        label: "projects"
      });

      return ctx.prisma.project.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          clientId: input.clientId,
          status: input.status,
          deadline: input.deadline ? new Date(input.deadline) : null,
          paymentStatus: input.paymentStatus
        }
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        clientId: z.string(),
        status: z.string(),
        deadline: z.string().optional(),
        paymentStatus: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.project.update({
        where: { id: project.id },
        data: {
          name: input.name,
          clientId: input.clientId,
          status: input.status,
          deadline: input.deadline ? new Date(input.deadline) : null,
          paymentStatus: input.paymentStatus
        }
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.project.delete({
        where: { id: project.id }
      });
    })
});
