"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Stats { tokens: number; badges: string[]; totalImages: number; }

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/creator-stats/${user.id}`)
        .then(res => res.json())
        .then(setStats)
        .catch(() => {});
    });
  }, [router]);

  if (!user || !stats) return null;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Total Images: {stats.totalImages}</p>
          <p>Total Tokens: {stats.tokens}</p>
          <p>Badges: {stats.badges.join(', ') || 'None'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
