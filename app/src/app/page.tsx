import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user has a shop
  const { data: profile } = await supabase
    .from("users")
    .select("shop_id")
    .eq("id", user.id)
    .single();

  if (!profile?.shop_id) {
    redirect("/auth/shop-setup");
  }

  redirect("/dashboard");
}
