import ProjectsSection from "@/components/ProjectsSection";

type Props = {
    searchParams?: { profileId?: string, plan:string };
};

export default async function ProjectsOnlyPage({ searchParams }: Props) {
    const profileId = Number(searchParams?.profileId ?? 0);
    const plan = (searchParams?.plan ?? '');
    return (
        <main className="p-6">
            <ProjectsSection profileId={profileId} plan={plan} />
        </main>
    );
}
