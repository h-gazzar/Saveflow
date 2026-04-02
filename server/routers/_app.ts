import { billingRouter } from "~/server/routers/billing";
import { clientsRouter } from "~/server/routers/clients";
import { invoicesRouter } from "~/server/routers/invoices";
import { leadsRouter } from "~/server/routers/leads";
import { projectsRouter } from "~/server/routers/projects";
import { timeRouter } from "~/server/routers/time";
import { createTRPCRouter } from "~/server/trpc";

export const appRouter = createTRPCRouter({
  clients: clientsRouter,
  projects: projectsRouter,
  invoices: invoicesRouter,
  leads: leadsRouter,
  time: timeRouter,
  billing: billingRouter
});

export type AppRouter = typeof appRouter;
