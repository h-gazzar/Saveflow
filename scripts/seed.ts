import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your environment.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const demoEmail = "demo@saveflow.app";
  const demoPassword = "SaveFlow123!";

  const existing = await supabase.auth.admin.listUsers();
  let user = existing.data.users.find((entry) => entry.email === demoEmail);

  if (!user) {
    const created = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Maya Carter"
      }
    });

    if (created.error || !created.data.user) {
      throw created.error ?? new Error("Failed to create demo user.");
    }

    user = created.data.user;
  }

  const userId = user.id;

  await supabase.from("transactions").delete().eq("user_id", userId);
  await supabase.from("savings_goals").delete().eq("user_id", userId);
  await supabase.from("profiles").upsert({
    id: userId,
    email: demoEmail,
    full_name: "Maya Carter",
    currency: "USD"
  });

  const goalsInsert = await supabase
    .from("savings_goals")
    .insert([
      {
        user_id: userId,
        title: "Emergency fund",
        target_amount: 5000,
        current_saved: 3200,
        target_date: "2026-09-30",
        category: "Emergency",
        notes: "Keep building a six-month cushion."
      },
      {
        user_id: userId,
        title: "New laptop",
        target_amount: 2200,
        current_saved: 980,
        target_date: "2026-07-15",
        category: "Tech",
        notes: "Replacing my aging freelance setup."
      },
      {
        user_id: userId,
        title: "Cairo getaway",
        target_amount: 1200,
        current_saved: 450,
        target_date: "2026-08-20",
        category: "Travel",
        notes: "Flights and hotel for a long weekend."
      }
    ])
    .select("id, title");

  if (goalsInsert.error || !goalsInsert.data) {
    throw goalsInsert.error ?? new Error("Failed to insert goals.");
  }

  const goalMap = new Map(goalsInsert.data.map((goal) => [goal.title, goal.id]));

  const transactionsInsert = await supabase.from("transactions").insert([
    { user_id: userId, type: "income", amount: 3200, category: "Salary", date: "2026-04-01", note: "Monthly salary" },
    { user_id: userId, type: "income", amount: 650, category: "Freelance", date: "2026-04-08", note: "Landing page project" },
    { user_id: userId, type: "expense", amount: 220, category: "Food", date: "2026-04-03", note: "Groceries and essentials" },
    { user_id: userId, type: "expense", amount: 90, category: "Transport", date: "2026-04-05", note: "Fuel and ride apps" },
    { user_id: userId, type: "expense", amount: 180, category: "Bills", date: "2026-04-07", note: "Utilities and internet" },
    { user_id: userId, type: "expense", amount: 300, category: "Savings", date: "2026-04-09", note: "Emergency fund top-up", savings_goal_id: goalMap.get("Emergency fund") },
    { user_id: userId, type: "expense", amount: 160, category: "Savings", date: "2026-04-11", note: "Laptop fund transfer", savings_goal_id: goalMap.get("New laptop") },
    { user_id: userId, type: "expense", amount: 75, category: "Entertainment", date: "2026-04-12", note: "Weekend dinner" },
    { user_id: userId, type: "expense", amount: 110, category: "Health", date: "2026-04-14", note: "Pharmacy and checkup" }
  ]);

  if (transactionsInsert.error) {
    throw transactionsInsert.error;
  }

  console.log("Seed complete.");
  console.log(`Demo login: ${demoEmail}`);
  console.log(`Demo password: ${demoPassword}`);
}

void main();
