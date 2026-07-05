'use client';

import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';

type ProjectItem = {
  id: number;
  title: string;
  description: string | null;
  url: string | null;
  website?: string | null;
  category?: string | 'General';
  targetindustry?: string | null;
  country?: string | 'International';
  coverImageUrl?: string | null;
    startedOn?: string | null;
    bio?: string | null;
    contactEmail?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

function getHostname(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function ProfileProjects({
  profileId,
  items,
}: {
  profileId: number;
  items: ProjectItem[];
}) {
  if (!items?.length) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm text-zinc-500 shadow-sm sm:p-5">
        No projects yet.
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {items.map((p) => {
        const started = formatDate(p.startedOn);
        const websiteLabel = getHostname(p.website || p.url);

        return (
          <div
            key={p.id}
            className="group min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Cover */}
            <div className="relative h-20 w-full overflow-hidden bg-zinc-100">
              {p.coverImageUrl ? (
                <img
                  src={p.coverImageUrl}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 text-sm font-medium text-zinc-400">
                  No cover image
                </div>
              )}
            </div>

            <div className="p-4">
              {/* Meta chips */}
              <div className="mb-3 flex flex-wrap gap-2">
                {p.category && (
                  <span className="max-w-full truncate rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {p.category}
                  </span>
                )}
                {p.targetindustry && (
                  <span className="max-w-full truncate rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                    {p.targetindustry}
                  </span>
                        )}
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                {p.country && (
                  <span className="max-w-full truncate rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {p.country }
                  </span>
                )}
                {started && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Since {started}
                  </span>
                )}
              </div>

              {/* Title */}
              <Link href={`/projects/${p.id}`} className="block">
                <h3 className="line-clamp-2 break-words text-base font-semibold text-zinc-900 transition group-hover:text-blue-700 sm:text-lg">
                  {p.title}
                </h3>
              </Link>

              {/* Description */}
              {p.description && (
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
                  {p.description || p.bio}
                </p>
              )}

              {/* Footer actions */}
              <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                <Link
                  href={`/projects/${p.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  View details
                </Link>

                {(p.website || p.url) && (
                  <TrackedLink
                    kind="project"
                    linkId={p.id}
                    profileId={profileId}
                    href={p.website || p.url || '#'}
                    className="inline-flex min-w-0 items-center justify-center truncate text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Visit {websiteLabel || 'website'}
                  </TrackedLink>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
