"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { History } from "@/components/history";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageItem {
  _id: string;
  storagePath: string;
  publicUrl: string;
}

export default function BrowsePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`);
        if (!res.ok) {
          console.error("Failed to fetch feed");
          return;
        }
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeed();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        ) : (
          <History archives={images} />
        )}
      </main>
    </div>
  );
}
