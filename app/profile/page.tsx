"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/use-session";

export default function ProfilePage() {
  const { user, loading } = useSession();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`);
        if (!res.ok) {
          throw new Error('Request failed');
        }
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user details.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [user, toast]);

  if (loading || !user) return null;

  const displayUser = userData || user;

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
              <p className="text-gray-600">{displayUser.email}</p>
            </div>
            <div>
              <h3 className="font-medium">User ID</h3>
              <p className="text-gray-600">{displayUser.id}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Sign In</h3>
              <p className="text-gray-600">
                {new Date(displayUser.last_sign_in_at || '').toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
