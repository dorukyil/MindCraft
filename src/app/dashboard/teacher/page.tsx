"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/");
      } else if (data.user.user_metadata?.role !== "teacher") {
        router.replace("/dashboard");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800 text-center">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Teacher
        </span>
        <h1 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-white">
          Welcome, {user.email}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          This is your teacher dashboard.
        </p>

        <button
          onClick={handleSignOut}
          className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
