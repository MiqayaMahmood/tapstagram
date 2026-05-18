// app/dashboard/projects/new/page.tsx
"use client";
import ProjectForm from "@/components/projects/ProjectForm";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';

const EXPLORE_PATH = "/explore";
type ProjectViewData = any;

function profileHref(p?: ProjectViewData["profile"]) {
    // Prefer profileId route if you have one, else username, else userId if that’s your route.

    if (p?.id) return `/p/${p.id}`;
    if (p?.username) return `/${p.username}`;
    if (p?.userId) return `/p/${p.userId}`;

    return EXPLORE_PATH;
}
export default function NewProjectPage() {
    // supply minimal defaults; profileId must be known (e.g., from session/profile fetch)
    // If you have a server util to get the active profileId, use it here.
    const { token, user } = useAuth();
    //const [user, setUser] = useState<any>(null);
    const router = useRouter();

 

    const onBack = () => {
        // Try browser back; if nothing meaningful, go to profile; else explore
        if (typeof window !== "undefined" && document.referrer && new URL(document.referrer).origin === location.origin) {
            router.back();
        } else {
            router.push(profileHref(user.profile) || EXPLORE_PATH);
        }
    };

    const profileId = user.profileId; // TODO: replace with real profileId
    
    return (
        <div className="max-w-7xl mx-auto">
            <ProjectForm
                mode="create"
                initial={{
                    profileId,
                    title: "",
                    slug: "",
                    url: "",
                    socialLinks: [],
                    isPublished: false,
                    sort_order: 0,
                    plan: user.plan ?? '',
                }}
            />
        </div>
    );
}
