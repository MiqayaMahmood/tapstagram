import { Suspense } from "react";
import MyNetworkClient from "./MyNetworkClient";

export default function MyNetworkPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Loading network…</div>}>
            <MyNetworkClient />
        </Suspense>
    );
}