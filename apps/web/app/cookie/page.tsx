import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
    title: "Cookie Policy — Tapstagram",
    description: "Cookie Policy for Tapstagram.",
};

export default function TermsPage() {
    const updated = "Effective date: 01.04.2026";

    return (
        <LegalPageShell>
            <main>
                <div className="mx-auto max-w-7xl py-2">
                    <div className="rounded-xl border border-zinc-400 bg-white p-8 shadow-sm">
                        <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            Legal
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                            Cookie Policy
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            {updated}
                        </p>

                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram uses cookies and similar technologies to provide, improve, and secure our services.
                            This Cookie Policy explains what these technologies are, how we use them, and what choices you have.
                            <br /><br />
                            By continuing to use Tapstagram, you agree to the use of cookies as described in this policy.
                        </p>

                        {/* 1 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            1. What Are Cookies and Similar Technologies
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            Cookies are small data files stored on your device when you visit a website.
                            We also use similar technologies such as pixels, local storage, and tracking identifiers to collect and store information.
                        </p>

                        <ul className="mt-4 px-4 space-y-3 text-sm text-zinc-700">
                            <li>
                                <b>Cookies:</b> Small files stored in your browser to recognize your device and remember information.
                            </li>
                            <li>
                                <b>Pixels:</b> Tiny images used to track interactions such as page views or email opens.
                            </li>
                            <li>
                                <b>Local Storage:</b> Stores data directly in your browser to improve performance and user experience.
                            </li>
                            <li>
                                <b>Other Technologies:</b> Device identifiers and similar tools used for analytics and functionality.
                            </li>
                        </ul>

                        {/* 2 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            2. Types of Cookies We Use
                        </h2>

                        <ul className="mt-3 px-4 space-y-3 text-sm text-zinc-700">
                            <li>
                                <b>Session Cookies:</b> Temporary cookies that expire when you close your browser.
                            </li>
                            <li>
                                <b>Persistent Cookies:</b> Remain on your device for a set period to remember preferences and login sessions.
                            </li>
                        </ul>

                        {/* 3 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            3. How We Use Cookies
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            We use cookies and similar technologies for the following purposes:
                        </p>

                        <ul className="mt-4 px-4 space-y-3 text-sm text-zinc-700">
                            <li>
                                <b>Authentication:</b> To keep you signed in and recognize your account.
                            </li>
                            <li>
                                <b>Security:</b> To protect against fraud, abuse, and unauthorized access.
                            </li>
                            <li>
                                <b>Preferences:</b> To remember your settings, language, and preferences.
                            </li>
                            <li>
                                <b>Functionality:</b> To enable features such as forms, login sessions, and faster navigation.
                            </li>
                            <li>
                                <b>Personalization:</b> To customize your experience based on your usage.
                            </li>
                            <li>
                                <b>Analytics:</b> To understand how users interact with profiles, pages, and features.
                            </li>
                        </ul>

                        {/* 4 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            4. Analytics and Performance Tracking
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            Tapstagram uses cookies to measure performance and understand user behavior, including:
                        </p>

                        <ul className="mt-4 px-4 space-y-3 text-sm text-zinc-700">
                            <li>• page visits and navigation</li>
                            <li>• clicks on links and media</li>
                            <li>• engagement with profiles and project pages</li>
                            <li>• lead submissions and interactions</li>
                        </ul>

                        <p className="mt-4 text-sm leading-7 text-zinc-600">
                            This helps us improve the platform and provide insights to profile and business owners.
                        </p>

                        {/* 5 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            5. Third-Party Cookies
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            We may allow trusted third-party providers to use cookies in connection with Tapstagram services, including:
                        </p>

                        <ul className="mt-4 px-4 space-y-3 text-sm text-zinc-700">
                            <li>• analytics providers</li>
                            <li>• hosting and infrastructure providers</li>
                            <li>• payment processors</li>
                            <li>• embedded content or integrations</li>
                        </ul>

                        <p className="mt-4 text-sm leading-7 text-zinc-600">
                            These third parties may collect information according to their own privacy policies.
                        </p>

                        {/* 6 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            6. Your Choices and Controls
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            You have control over how cookies are used:
                        </p>

                        <ul className="mt-4 px-4 space-y-3 text-sm text-zinc-700">
                            <li>• You can configure your browser to block or delete cookies</li>
                            <li>• You can clear stored cookies at any time</li>
                            <li>• You can disable certain tracking features via browser settings</li>
                        </ul>

                        <p className="mt-4 text-sm leading-7 text-zinc-600">
                            Please note that disabling cookies may affect the functionality and performance of Tapstagram.
                        </p>

                        {/* 7 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            7. Do Not Track
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            Some browsers offer a “Do Not Track” (DNT) setting. Currently, there is no consistent industry standard for responding to DNT signals, so Tapstagram does not respond to them.
                        </p>

                        {/* 8 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            8. Updates to This Policy
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.
                        </p>

                        {/* 9 */}
                        <h2 className="mt-8 text-2xl font-semibold text-zinc-900">
                            9. Contact Us
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            If you have questions about this Cookie Policy, you can contact us at:
                            <br /><br />
                            <span className="font-medium text-zinc-800">Tapstagram</span><br />
                            Email: info@tapstagram.com
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        {/* optional additional sections */}
                    </div>
                </div>
            </main>
        </LegalPageShell>
    );
}