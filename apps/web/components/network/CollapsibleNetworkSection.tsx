'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ArrowUpDown, Trash2 } from 'lucide-react';

type SortOption = 'az' | 'za' | 'newest' | 'oldest';

type BaseItem = {
  id: number | string;
  name?: string | null;
  title?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  followedAt?: string | null;
  bookmarkedAt?: string | null;
};

type Props<T extends BaseItem> = {
  title: string;
  count: number;
  items: T[];
  type: 'profile' | 'project';
    emptyText: string;
    buttonLabel: string;
  defaultOpen?: boolean;
  renderItem: (item: T, onRemove: (item: T) => void) => React.ReactNode;
  onRemove?: (item: T) => Promise<void> | void;
};

function getItemLabel(item: BaseItem) {
  return (item.name || item.title || '').toLowerCase().trim();
}

function getItemDate(item: BaseItem) {
  return (
    item.followedAt ||
    item.bookmarkedAt ||
    item.createdAt ||
    item.created_at ||
    ''
  );
}

export default function CollapsibleNetworkSection<T extends BaseItem>({
  title,
  count,
  items,
  type,
    emptyText,
  buttonLabel,
  defaultOpen = false,
  renderItem,
  onRemove,
}: Props<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const [sort, setSort] = useState<SortOption>('newest');
  const [removingId, setRemovingId] = useState<number | string | null>(null);
  const ButtonLabel = buttonLabel || 'Remove';
  const sortedItems = useMemo(() => {
    const cloned = [...items];

    cloned.sort((a, b) => {
      if (sort === 'az') return getItemLabel(a).localeCompare(getItemLabel(b));
      if (sort === 'za') return getItemLabel(b).localeCompare(getItemLabel(a));

      const da = new Date(getItemDate(a)).getTime() || 0;
      const db = new Date(getItemDate(b)).getTime() || 0;

      if (sort === 'newest') return db - da;
      return da - db;
    });

    return cloned;
  }, [items, sort]);

  async function handleRemove(item: T) {
    if (!onRemove) return;
    try {
      setRemovingId(item.id);
      await onRemove(item);
    } finally {
      setRemovingId(null);
    }
  }

  const sectionTone =
    type === 'profile'
      ? 'bg-gradient-to-b from-blue-50/60 to-white'
      : 'bg-gradient-to-b from-emerald-50/60 to-white';

  const badgeTone =
    type === 'profile'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-emerald-100 text-emerald-700';

  return (
    <section className={`rounded-2xl border border-zinc-300 p-4 shadow-sm ${sectionTone}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeTone}`}>
            {count}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-transparent outline-none"
            >
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {open ? (
        <div className="mt-4 space-y-3">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <div key={item.id} className="group relative">
                {renderItem(item, () => handleRemove(item))}

                {onRemove ? (
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    disabled={removingId === item.id}
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                            {removingId === item.id ? 'Removing…' : ButtonLabel}
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white/70 px-4 py-6 text-sm text-zinc-500">
              {emptyText}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}