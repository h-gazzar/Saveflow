import { z } from "zod";

import { getPlanLimit } from "~/lib/planGates";
import { createTRPCRouter, enforceLimit, protectedProcedure } from "~/server/trpc";

function formatInvoiceNumber(num: number) {
  return `#${String(num).padStart(4, "0")}`;
}

export const invoicesRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.invoice.findMany({
      where: { userId: ctx.user.id },
      include: { client: true },
      orderBy: { createdAt: "desc" }
    })
  ),
  getNextNumber: protectedProcedure.query(async ({ ctx }) => {
    const lastInvoice = await ctx.prisma.invoice.findFirst({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: "desc" }
    });

    const numeric = Number(lastInvoice?.number.replace(/\D/g, "") ?? "0");
    return formatInvoiceNumber(numeric + 1);
  }),
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        amount: z.number().positive(),
        date: z.string(),
        status: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.prisma.invoice.count({ where: { userId: ctx.user.id } });
      enforceLimit({
        currentCount: count,
        limit: getPlanLimit(ctx.user.plan, "invoices"),
        label: "invoices"
      });

      const nextNumber = await ctx.prisma.invoice.findFirst({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "desc" }
      });

      const current = Number(nextNumber?.number.replace(/\D/g, "") ?? "0");

      return ctx.prisma.invoice.create({
        data: {
          userId: ctx.user.id,
          clientId: input.clientId,
          number: formatInvoiceNumber(current + 1),
          amount: input.amount,
          date: new Date(input.date),
          status: input.status
          // TODO: phase 2 pdf invoice generation
        }
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        clientId: z.string(),
        amount: z.number().positive(),
        date: z.string(),
        status: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          clientId: input.clientId,
          amount: input.amount,
          date: new Date(input.date),
          status: input.status
        }
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id }
      });

      return ctx.prisma.invoice.delete({
        where: { id: invoice.id }
      });
    })
});
