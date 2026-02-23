import { ScrollText } from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center gap-2 justify-center h-72 text-sm text-current/50">
    <ScrollText className="text-white/80" size={28} strokeWidth={1} />
    No data
  </div>
);
