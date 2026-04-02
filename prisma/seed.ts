import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.timeEntry.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      supabaseId: "seed-supabase-user-1",
      email: "alex@soloflow.dev",
      plan: "pro",
      clients: {
        create: [
          {
            name: "Lina Mercer",
            email: "lina@northwindstudio.com",
            company: "Northwind Studio",
            notes: "Prefers async updates on Tuesdays and Fridays."
          },
          {
            name: "Owen Brooks",
            email: "owen@meridianhq.com",
            company: "Meridian HQ",
            notes: "Retainer client, usually renews quarterly."
          },
          {
            name: "Sara Elmasry",
            email: "sara@lumenpress.co",
            company: "Lumen Press",
            notes: "Book launch microsite planned for Q3."
          }
        ]
      }
    },
    include: {
      clients: true
    }
  });

  const [northwind, meridian, lumen] = user.clients;

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Northwind portfolio revamp",
        clientId: northwind.id,
        status: "active",
        deadline: new Date("2026-04-18"),
        paymentStatus: "paid"
      }
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Meridian launch funnel",
        clientId: meridian.id,
        status: "proposal",
        deadline: new Date("2026-04-26"),
        paymentStatus: "warning"
      }
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Lumen editorial hub",
        clientId: lumen.id,
        status: "active",
        deadline: new Date("2026-05-07"),
        paymentStatus: "unpaid"
      }
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Northwind case study system",
        clientId: northwind.id,
        status: "done",
        deadline: new Date("2026-03-29"),
        paymentStatus: "paid"
      }
    })
  ]);

  await prisma.invoice.createMany({
    data: [
      {
        userId: user.id,
        number: "#0024",
        clientId: northwind.id,
        amount: 1800,
        date: new Date("2026-03-12"),
        status: "paid"
      },
      {
        userId: user.id,
        number: "#0025",
        clientId: meridian.id,
        amount: 950,
        date: new Date("2026-03-19"),
        status: "unpaid"
      },
      {
        userId: user.id,
        number: "#0026",
        clientId: lumen.id,
        amount: 1400,
        date: new Date("2026-03-24"),
        status: "paid"
      },
      {
        userId: user.id,
        number: "#0027",
        clientId: northwind.id,
        amount: 600,
        date: new Date("2026-03-28"),
        status: "warning"
      }
    ]
  });

  await prisma.lead.createMany({
    data: [
      { userId: user.id, name: "Maya Chen", company: "Orbit Goods", stage: "lead", value: 1200, order: 0 },
      { userId: user.id, name: "Karim Salah", company: "Tidal Health", stage: "contacted", value: 2600, order: 0 },
      { userId: user.id, name: "Julia Voss", company: "Canvas North", stage: "negotiation", value: 3400, order: 0 },
      { userId: user.id, name: "Ethan Cole", company: "Juniper Audio", stage: "won", value: 2100, order: 0 },
      { userId: user.id, name: "Nora Aziz", company: "Blink Studio", stage: "lost", value: 900, order: 0 }
    ]
  });

  await prisma.timeEntry.createMany({
    data: [
      { userId: user.id, projectId: projects[0].id, hours: 12, rate: 85 },
      { userId: user.id, projectId: projects[2].id, hours: 7.5, rate: 95 },
      { userId: user.id, projectId: projects[3].id, hours: 5.25, rate: 80 }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
