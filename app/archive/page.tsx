"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Entry {
  id: string;
  text: string;
}

export default function ArchivePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("archive_entries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("archive_entries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const entry: Entry = { id: Date.now().toString(), text: text.trim() };
    setEntries((prev) => [...prev, entry]);
    setText("");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-10 space-y-6">
        <form onSubmit={addEntry} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add new entry"
          />
          <Button type="submit">Add</Button>
        </form>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <span>{entry.text}</span>
              <Button variant="ghost" onClick={() => removeEntry(entry.id)}>
                Archive
              </Button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
