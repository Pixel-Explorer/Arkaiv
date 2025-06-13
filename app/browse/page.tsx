"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { History } from "@/components/history";

interface ImageItem {
  _id: string;
  storagePath: string;
  publicUrl: string;
}

export default function BrowsePage() {
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    async function fetchFeed() {
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
      }
    }

    fetchFeed();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-10">
        <History archives={images} />
      </main>
    </div>
  );
}
