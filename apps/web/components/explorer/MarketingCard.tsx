import Link from 'next/link';

export default function MarketingCard() {
    return (
        <div className="border border-zinc-400 rounded-xl p-4 bg-white">
            <div className="text-lg font-bold">Are you not on Tapstagram?</div>
            <p className="text-lg text-gray-700 mt-1">Create and share your profile with the world.</p>
            <Link href="/" className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white text-md">
                <span>Create your profile</span>
            </Link>
        </div>
    );
}
