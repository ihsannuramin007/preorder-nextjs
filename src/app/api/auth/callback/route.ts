import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const existingUser = await prisma.user.findUnique({
        where: { supabaseId: data.user.id },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            supabaseId: data.user.id,
            email: data.user.email!,
            businessName: data.user.user_metadata?.full_name ?? "Toko Baru",
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/masuk?error=auth_callback_error`);
}
