"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ImageItem {
  _id: string;
  storagePath: string;
}

export default function HashtagViewPage() {
  const params = useParams();
  const { toast } = useToast();
  const tagId = params.id as string;
  const [images, setImages] = useState<ImageItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hashtags/${tagId}/images`)
      .then((res) => res.json())
      .then(setImages)
      .catch(console.error);
  }, [tagId]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to upload", variant: "destructive" });
      return;
    }
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, { method: "POST", body: formData });
      if (res.ok) {
        const img = await res.json();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${img._id}/hashtags/${tagId}`, { method: "POST" });
      }
    }
    setFiles([]);
    const refreshed = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hashtags/${tagId}/images`);
    if (refreshed.ok) setImages(await refreshed.json());
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-10 space-y-4">
        <div className="flex items-center gap-2">
          <Input type="file" multiple onChange={handleSelect} />
          <Button onClick={handleUpload} disabled={files.length === 0}>Upload</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <a key={img._id} href={img.storagePath} download className="block">
              <img src={img.storagePath} alt="" className="aspect-square w-full object-cover rounded-md border" />
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
