"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

interface ImageItem {
  _id: string;
  storagePath: string;
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <Link href={`/images/${img._id}`} key={img._id} className="block">
              <img
                src={img.storagePath}
                alt="Image thumbnail"
                className="aspect-square w-full rounded-md object-cover border"
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
