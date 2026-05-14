"use client";

import { ExternalLink, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type Announcement as AnnouncementItem,
  getUserAnnouncements,
} from "@/api/announcements";

const DISMISSED_KEY = "announcement:dismissed-local";

function readDismissedIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeDismissedIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
}

const Announcement = () => {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const idsKey = useMemo(() => items.map((x) => x.id).join(","), [items]);

  useEffect(() => {
    setDismissedIds(readDismissedIds());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const pull = async () => {
      const next = await getUserAnnouncements();
      if (!isMounted) {
        return;
      }
      const hidden = new Set(dismissedIds);
      const visible = next.filter((x) => !hidden.has(x.id));
      const nextIds = visible.map((x) => x.id).join(",");
      if (nextIds !== idsKey) {
        setItems(visible);
        setIndex(0);
      }
    };

    void pull();
    const timer = setInterval(() => {
      void pull();
    }, 60_000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [idsKey, dismissedIds]);

  const current = items[index];

  if (!current) {
    return null;
  }

  const closeCurrent = () => {
    const currentId = current.id;
    setDismissedIds((prev) => {
      if (prev.includes(currentId)) {
        return prev;
      }
      const next = [...prev, currentId];
      writeDismissedIds(next);
      return next;
    });
    setItems((prev) => {
      const filtered = prev.filter((x) => x.id !== currentId);
      if (filtered.length === 0) {
        return [];
      }
      if (index >= filtered.length) {
        setIndex(filtered.length - 1);
      }
      return filtered;
    });
  };

  return (
    <div className="fixed z-50 top-3 right-3 sm:top-4 sm:right-4">
      <div className="relative flex flex-col rounded-md py-2.5 px-3.5 w-[min(92vw,28rem)] bg-accent text-white shadow-lg border border-white/15">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1 font-bold text-sm">
            <Sparkles size={14} /> Announcement
          </span>
          <button
            type="button"
            className="flex items-center justify-center cursor-pointer"
            onClick={closeCurrent}
          >
            <span className="text-xs">
              <X size={14} />
            </span>
          </button>
        </div>
        <p className="text-sm font-semibold mb-1 leading-snug">{current.title}</p>
        <p className="text-sm leading-snug">{current.body}</p>
        {current.link && (
          <a
            className="text-sm underline underline-offset-2"
            target="_blank"
            href={current.link}
            rel="noreferrer"
          >
            Learn more <ExternalLink className="inline-block mr-1" size={14} />
          </a>
        )}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="text-xs opacity-80">
            {index + 1} of {items.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 text-xs border border-white/30 rounded disabled:opacity-40"
              disabled={index === 0}
              onClick={() => setIndex((v) => Math.max(0, v - 1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs border border-white/30 rounded disabled:opacity-40"
              disabled={index >= items.length - 1}
              onClick={() => setIndex((v) => Math.min(items.length - 1, v + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
