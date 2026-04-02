import { redirect } from "next/navigation";

import { prisma } from "~/lib/prisma";
import { createSupabaseServerClient } from "~/lib/supabase-server";

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) {
    return null;
  }

  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.id },
    create: {
      supabaseId: user.id,
      email: user.email
    },
    update: {
      email: user.email
    }
  });

  return dbUser;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
