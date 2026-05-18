import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
    title: "Privacy Policy — Tapstagram",
    description: "Privacy Policy for Tapstagram.",
};

export default function PrivacyPage() {
    const updated = "Effective date: 11.04.2026";

    return (
        <LegalPageShell>
            <main>
                <div className="mx-auto max-w-7xl py-2">
                    <div className="rounded-xl border border-zinc-400 bg-white p-8 shadow-sm">
                        <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            Legal
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                            Privacy Policy
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            {updated}
                        </p>

                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            At Tapstagram, we care about your privacy and want to be transparent about how we collect, use, store, and share your information.
                            This Privacy Policy explains how Tapstagram handles personal data when you use our website, digital profile pages, NFC cards, business and project pages, and related services.
                            <br />
                            <br />
                            By using Tapstagram, you agree to the practices described in this Privacy Policy.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            1. Who We Are
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram is a digital identity and networking platform that helps individuals, professionals, and businesses create online profiles, showcase projects, share links and media, connect through NFC cards, and measure engagement such as visits, clicks, and leads.
                            <br />
                            <br />
                            In this Privacy Policy, “Tapstagram,” “we,” “our,” and “us” refer to the Tapstagram platform and related services.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            2. What This Policy Covers
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            This Privacy Policy applies to your use of:
                        </p>
                        <ul className="mt-2 px-4 space-y-2 text-sm leading-7 text-zinc-700">
                            <li>• the Tapstagram website</li>
                            <li>• profile and project pages hosted by Tapstagram</li>
                            <li>• NFC card services</li>
                            <li>• premium features and upgrades</li>
                            <li>• lead and contact forms</li>
                            <li>• analytics and visitor tracking tools</li>
                            <li>• support, contact, and marketing communications</li>
                        </ul>

                        <p className="mt-4 max-w-7xl text-sm leading-7 text-zinc-600">
                            This policy applies whether you are:
                        </p>
                        <ul className="mt-2 px-4 space-y-2 text-sm leading-7 text-zinc-700">
                            <li>• a registered user</li>
                            <li>• a profile owner</li>
                            <li>• a business or project owner</li>
                            <li>• a visitor browsing public Tapstagram pages</li>
                            <li>• a customer ordering a product or premium service</li>
                        </ul>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            3. Information We Collect
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We collect information in different ways depending on how you use Tapstagram.
                        </p>

                        <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                            3.1 Information You Provide Directly
                        </h3>
                        <p className="mt-2 max-w-7xl text-sm leading-7 text-zinc-600">
                            When you create an account, build a profile, publish a project page, contact us, place an order, or upgrade to a premium service, you may provide information such as your name, email address, phone number, profile details, business or project details, social links, media uploads, contact information, address details, and other information you choose to share.
                        </p>

                        <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                            3.2 Information We Collect When You Use Tapstagram
                        </h3>
                        <p className="mt-2 max-w-7xl text-sm leading-7 text-zinc-600">
                            When you browse or interact with Tapstagram, we may collect technical and usage information such as your IP address, browser type, device type, operating system, session identifiers, pages visited, clicks, referral source, date and time of activity, and similar engagement information.
                        </p>

                        <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                            3.3 Information From Public Pages and Lead Forms
                        </h3>
                        <p className="mt-2 max-w-7xl text-sm leading-7 text-zinc-600">
                            If you visit a Tapstagram profile or project page and submit an inquiry, we may collect your name, email address, phone number, country, message details, referral source, and the page or profile you contacted.
                        </p>

                        <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                            3.4 Orders and Premium Services
                        </h3>
                        <p className="mt-2 max-w-7xl text-sm leading-7 text-zinc-600">
                            If you order an NFC card or purchase premium features, we may collect order details, delivery information, billing-related information, selected package details, and customization preferences. Payment processing may be handled by third-party providers under their own policies.
                        </p>

                        <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                            3.5 Cookies and Similar Technologies
                        </h3>
                        <p className="mt-2 max-w-7xl text-sm leading-7 text-zinc-600">
                            We may use cookies, local storage, analytics tags, and similar technologies to keep you signed in, remember preferences, measure engagement, improve performance, and support analytics and marketing activities.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            4. How We Use Information
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We use the information we collect to operate, support, and improve Tapstagram. This includes creating and managing accounts, displaying profiles and project pages, enabling digital sharing and NFC card experiences, processing orders and premium upgrades, responding to inquiries, sending service-related communications, providing analytics, protecting the platform from misuse, and improving the overall user experience.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            5. Public Content and Visibility
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram is designed to help users share their digital identity and content. Depending on how a profile or page is configured, certain information may be visible publicly, including your name, title, bio, profile image, social links, website links, project content, and selected media.
                            <br />
                            <br />
                            Please do not upload or publish information that you do not want others to view publicly.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            6. Analytics, Tracking, and Engagement
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram may provide analytics to page owners and businesses, such as page visits, link clicks, social engagement, lead submissions, and visitor trends over time. This data helps users understand how their profile, project, or business page is performing.
                            <br />
                            <br />
                            We may also use aggregated and non-identifiable analytics internally to improve the platform.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            7. How We Share Information
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We do not sell your personal information in the ordinary sense of selling user data to outside parties. We may share information in limited situations, including:
                        </p>
                        <ul className="mt-2 px-4 space-y-2 text-sm leading-7 text-zinc-700">
                            <li>• with service providers who help us operate Tapstagram, such as hosting, email, analytics, security, and payment providers</li>
                            <li>• with page owners or business owners when you submit a lead or contact form on their page</li>
                            <li>• when required by law or necessary to protect rights, safety, platform integrity, or investigate abuse</li>
                            <li>• in connection with a merger, restructuring, acquisition, or sale of all or part of the business</li>
                        </ul>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            8. Email Communications
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We may send emails related to account activity, login verification, profile actions, order updates, support requests, lead notifications, platform updates, and service announcements. You may opt out of promotional emails, but you may still receive essential account or service-related communications.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            9. Data Retention
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We retain personal information for as long as necessary to provide the service, maintain accounts and analytics, fulfill orders, respond to support and legal requirements, prevent fraud and abuse, and comply with our obligations. When information is no longer needed, we may delete, anonymize, or retain only what is required for operational, legal, or security purposes.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            10. Your Rights and Choices
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Depending on your location and applicable law, you may have the right to access, correct, update, delete, or request a copy of your personal information. You may also have the right to object to certain uses of your information or withdraw consent where processing depends on consent.
                            <br />
                            <br />
                            You may be able to manage some of your information directly through your Tapstagram account, or by contacting us.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            11. Account Closure and Deletion
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            If you close your account or ask us to delete your data, your public profile may stop being visible. Some information may still be retained for legal, security, fraud prevention, order history, analytics integrity, or compliance reasons.
                            <br />
                            <br />
                            Content already shared publicly, cached by search engines, or submitted to others may remain visible outside our control for a period of time.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            12. Security
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We take reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, alteration, or loss. However, no system can be guaranteed to be completely secure, and you are responsible for protecting your account credentials.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            13. International Data Transfers
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram and its service providers may process data in countries outside your own. By using the platform, you understand that your information may be transferred to and processed in jurisdictions that may have different data protection rules than your home country.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            14. Children’s Privacy
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram is not intended for children under the age required by applicable law to use our services independently. We do not knowingly collect personal information from children in violation of applicable law.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            15. Third-Party Links and Services
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram pages may include links to third-party websites, social platforms, payment providers, and other services. We are not responsible for the privacy practices of those third parties. Their own policies apply when you interact with them.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            16. Changes to This Privacy Policy
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We may update this Privacy Policy from time to time. When we make changes, we may revise the effective date and post the updated version on our website. Your continued use of Tapstagram after changes take effect means the updated policy applies to your use of the service.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            17. Contact Us
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            If you have questions, privacy requests, or concerns about this Privacy Policy, you can contact us at:
                            <br />
                            <br />
                            <span className="font-medium text-zinc-800">Tapstagram</span>
                            <br />
                            Email: info@tapstagram.com
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        {/* keep your existing privacy sections exactly here */}
                    </div>
                </div>
            </main>
        </LegalPageShell>
            
    );
}