"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [router]);

  if (!user) return null;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium">User ID</h3>
              <p className="text-gray-600">{user.id}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Sign In</h3>
              <p className="text-gray-600">
                {new Date(user.last_sign_in_at || '').toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}