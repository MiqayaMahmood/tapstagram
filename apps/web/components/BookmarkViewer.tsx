'use client';

export default function BookmarkViewer() {
  const bookmarks = [
    { id: 1, name: 'Jane Smith', role: 'Designer', profileUrl: '/profile/jane' },
    { id: 2, name: 'Tech Agency', role: 'Agency', profileUrl: '/profile/tech-agency' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Bookmarked Profiles</h2>
      {bookmarks.map((bm) => (
        <div key={bm.id} className="border rounded p-4 shadow-sm flex justify-between">
          <div>
            <h3 className="font-semibold">{bm.name}</h3>
            <p className="text-sm text-gray-600">{bm.role}</p>
          </div>
          <a
            href={bm.profileUrl}
            className="text-blue-600 text-sm hover:underline"
          >
            View Profile
          </a>
        </div>
      ))}
    </div>
  );
}
