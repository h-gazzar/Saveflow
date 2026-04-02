import { prisma } from "~/lib/prisma";
import { createSupabaseServerClient } from "~/lib/supabase-server";

export async function createTRPCContext() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser }
  } = await supabase.auth.getUser();

  let user = null;

  if (authUser?.id && authUser.email) {
    user = await prisma.user.upsert({
      where: { supabaseId: authUser.id },
      create: {
        supabaseId: authUser.id,
        email: authUser.email
      },
      update: {
        email: authUser.email
      }
    });
  }

  return {
    prisma,
    user
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
