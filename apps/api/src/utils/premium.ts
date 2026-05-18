export function isPremiumPlan(plan?: string | null) {
    return (plan || "").toLowerCase() === "premium";
}