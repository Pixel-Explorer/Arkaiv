"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/use-session';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface Transaction {
  _id: string;
  imageId: string;
  tokens: number;
  createdAt: string;
}

interface Stats {
  totalTokens: number;
  transactions: Transaction[];
}

export default function WalletPage() {
  const { user, loading } = useSession();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/creator-stats/${user.id}`);
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load wallet data.',
          variant: 'destructive',
        });
      }
    };
    fetchStats();
  }, [user, toast]);

  if (loading || !user) return null;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium">Total Tokens</h3>
            <p className="text-gray-600">{stats?.totalTokens ?? 0}</p>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Recent Transactions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Image ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.transactions?.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{tx.tokens}</TableCell>
                    <TableCell>{tx.imageId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
