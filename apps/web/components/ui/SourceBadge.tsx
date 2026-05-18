// SourceBadge.tsx
export function SourceBadge({ source }: { source: string }) {
    const map: any = {
        nfc: "bg-blue-100 text-blue-700",
        web: "bg-gray-100 text-gray-700",
        qr: "bg-green-100 text-green-700",
    };

    return (
        <span className={`rounded px-2 py-1 text-xs ${map[source] || map.web}`}>
            {source.toUpperCase()}
        </span>
    );
}
