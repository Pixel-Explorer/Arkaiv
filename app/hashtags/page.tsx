"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

interface Tag {
  _id: string;
  tag: string;
}

export default function HashtagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hashtags`)
      .then((res) => res.json())
      .then(setTags)
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-10">
        <ul className="space-y-2">
          {tags.map((t) => (
            <li key={t._id}>
              <Link href={`/hashtags/${t._id}`} className="text-blue-600 hover:underline">
                {t.tag}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
