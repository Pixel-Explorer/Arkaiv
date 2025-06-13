import Link from "next/link";

interface ArchiveItem {
  _id: string;
  storagePath: string;
  publicUrl: string;
}

interface HistoryProps {
  archives: ArchiveItem[];
}

export function History({ archives }: HistoryProps) {
  if (!archives || archives.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No archived items found.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {archives.map((item) => (
        <Link href={`/images/${item._id}`} key={item._id} className="block">
          <img
            src={item.publicUrl}
            alt="Archived item"
            className="aspect-square w-full rounded-md object-cover border"
          />
        </Link>
      ))}
    </div>
  );
}
