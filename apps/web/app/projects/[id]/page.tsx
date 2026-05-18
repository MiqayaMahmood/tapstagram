// app/projects/[id]/page.tsx
import { cookies } from "next/headers";
import ProjectView from "@/components/projects/ProjectView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function loadProject(id: number) {
    const cookieHeader = cookies().getAll().map(c => `${c.name}=${c.value}`).join("; ");
    const r = await fetch(`${API_BASE}/projects/projectPublicViewById/${id}`, {
        headers: { cookie: cookieHeader }, // lets owner preview drafts
        cache: "no-store",
    });
    if (r.status === 404) return { notFound: true as const };
    if (!r.ok) throw new Error(`Failed: ${r.status}`);
    return { notFound: false as const, data: await r.json() };
}

export default async function ProjectPublicPage({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    const res = await loadProject(id);
    if (res.notFound) return <div className="max-w-6xl mx-auto p-6">Project not found.</div>;
    return (
        <div className="max-w-7xl mx-auto">
            <ProjectView project={res.data} />
        </div>
    );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    const res = await loadProject(id);
    if (res.notFound) return {};
    const p = res.data;
    return {
        title: p.title,
        description: p.bio ?? p.description ?? "",
        openGraph: {
            title: p.title,
            description: p.bio ?? p.description ?? "",
            images: p.coverImageUrl ? [{ url: p.coverImageUrl }] : undefined,
        },
    };
}
