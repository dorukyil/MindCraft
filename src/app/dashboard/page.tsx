"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/client";

// Catch-all for /dashboard — redirect to the role-specific page.
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/");
      } else {
        const role = data.user.user_metadata?.role;
        router.replace(role === "teacher" ? "/dashboard/teacher" : "/dashboard/student");
      }
    });
  }, [router]);

  return null;
}
