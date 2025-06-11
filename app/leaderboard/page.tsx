"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Entry { id: string; name: string; tokens: number; }

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`)
      .then(res => res.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {entries.map((e, i) => (
              <li key={e.id} className="flex justify-between">
                <span>{i + 1}. {e.name || e.id}</span>
                <span>{e.tokens} tokens</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
