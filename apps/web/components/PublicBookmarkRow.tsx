// apps/web/src/components/PublicBookmarkRow.tsx
'use client';
import BookmarkButton from '@/components/ProfileBookmarkButton';

export default function PublicBookmarkRow({ profileId }: { profileId: number }) {
    return (
        <div className="flex justify-end">
            <BookmarkButton profileId={profileId} />
        </div>
    );
}
