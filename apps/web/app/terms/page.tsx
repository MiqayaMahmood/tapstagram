import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
    title: "Terms of Service — Tapstagram",
    description: "Terms of Service for Tapstagram.",
};

export default function TermsPage() {
    const updated = "Effective date: [01.04.2026]";

    return (
        <LegalPageShell>
            <main>
                <div className="mx-auto max-w-7xl py-2">
                    <div className="rounded-xl border border-zinc-400 bg-white p-8 shadow-sm">
                        <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            Legal
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                            Terms of Service
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                            {updated}
                        </p>

                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            These Terms of Service govern your access to and use of Tapstagram, including your account, profile pages, project pages, NFC card services, premium features, analytics, and related services.
                            <br />
                            <br />
                            By creating an account, using Tapstagram, creating or managing a profile or project page, ordering a Tapstagram NFC card, or accessing any part of the platform, you agree to be bound by these Terms.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            1. About Tapstagram
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram is a digital identity and networking platform that enables individuals, professionals, creators, and businesses to create digital profiles, publish project and business pages, share links and media, collect leads, measure engagement, and connect through NFC-enabled cards and related tools.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            2. Agreement to These Terms
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            By accessing or using Tapstagram, you confirm that you have read, understood, and agree to these Terms. If you are using Tapstagram on behalf of a company, organization, or other entity, you represent that you are authorized to bind that entity to these Terms.
                            <br />
                            <br />
                            If you do not agree to these Terms, do not use Tapstagram.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            3. Eligibility and Accounts
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            You may use Tapstagram only if you are legally capable of entering into a binding agreement and are permitted to use the services under applicable law.
                            <br />
                            <br />
                            You are responsible for:
                        </p>
                        <ul className="mt-2 px-4 space-y-2 text-sm leading-7 text-zinc-700">
                            <li>• providing accurate registration information</li>
                            <li>• maintaining the security of your account credentials</li>
                            <li>• keeping your contact information current</li>
                            <li>• all activity that occurs under your account</li>
                        </ul>

                        <p className="mt-4 max-w-7xl text-sm leading-7 text-zinc-600">
                            We may suspend or terminate accounts that provide false information, violate these Terms, or create risk for Tapstagram, its users, or third parties.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            4. Profiles, Pages, and Administrators
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram allows users to create and manage personal profiles, business profiles, and project pages. If you manage a profile or page on behalf of a business, brand, or organization, you are responsible for ensuring that all information is accurate and that you have authority to act on that entity’s behalf.
                            <br />
                            <br />
                            If a page has multiple administrators, each administrator is responsible for actions taken through their access. Tapstagram may, at its discretion, limit, suspend, or remove administrative access when needed for security, compliance, ownership disputes, misuse, or platform integrity.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            5. Content and Conduct
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            You are responsible for the content you upload, publish, link to, or otherwise make available on Tapstagram.
                            <br />
                            <br />
                            You agree that you will not:
                        </p>
                        <ul className="mt-2 px-4 space-y-2 text-sm leading-7 text-zinc-700">
                            <li>• publish false, misleading, defamatory, fraudulent, or unlawful content</li>
                            <li>• infringe the intellectual property, privacy, or other rights of others</li>
                            <li>• upload malicious code, harmful files, or unsafe links</li>
                            <li>• impersonate another person, brand, or organization</li>
                            <li>• misuse the platform for spam, abuse, scraping, phishing, or harassment</li>
                            <li>• use Tapstagram in a way that violates applicable law or regulation</li>
                        </ul>

                        <p className="mt-4 max-w-7xl text-sm leading-7 text-zinc-600">
                            We reserve the right to remove content or restrict access where we believe content violates these Terms, applicable law, or creates risk to the platform or other users.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            6. Your Content and License to Tapstagram
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            You retain ownership of the content you submit to Tapstagram. However, by uploading or publishing content through the platform, you grant Tapstagram a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, distribute, and process that content solely for the purpose of operating, improving, promoting, and providing the service.
                            <br />
                            <br />
                            You represent that you have all rights necessary to upload and use that content and to grant this license.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            7. Lead Forms and Contact Requests
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram may allow profile owners, page owners, and businesses to receive inquiries and lead submissions through forms. If you use these tools, you are responsible for handling submitted data lawfully and in accordance with your own privacy obligations.
                            <br />
                            <br />
                            You may only use lead or contact data for legitimate and lawful business purposes. You must not sell submitted lead information, misuse it, or use it in a way that violates applicable law.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            8. NFC Cards, Orders, and Premium Services
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram may offer NFC cards, premium features, upgrades, customization options, and other paid services. By placing an order or purchasing a paid service, you agree to provide accurate purchase and delivery information and to pay all applicable fees, taxes, shipping costs, and related charges.
                            <br />
                            <br />
                            Additional terms may apply to specific products, premium subscriptions, custom designs, or business services. We reserve the right to modify pricing, packaging, available features, and service offerings at any time.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            9. Analytics and Insights
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram may provide analytics and engagement insights such as visits, clicks, leads, and related performance metrics. These insights are provided for informational purposes only. We do not guarantee the availability, accuracy, completeness, or retention of any particular analytics data or reporting.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            10. Platform Availability and Service Limits
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We may modify, suspend, discontinue, remove, or limit any feature, page, account, or part of the service at any time. We are not obligated to maintain any specific functionality, content display, custom configuration, or historical data indefinitely.
                            <br />
                            <br />
                            We may also take action to protect Tapstagram, its users, partners, and systems, including limiting access, changing page details, or removing content or accounts where necessary.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            11. Privacy
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Your use of Tapstagram is also subject to our Privacy Policy, which explains how we collect, use, store, and share personal information. By using Tapstagram, you acknowledge that you have reviewed our Privacy Policy.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            12. Intellectual Property
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram and its related branding, software, design elements, platform features, and service materials are protected by intellectual property laws. Except as expressly permitted, you may not copy, modify, distribute, reverse engineer, frame, mirror, scrape, or otherwise exploit any part of Tapstagram without prior written permission.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            13. Feedback
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            If you submit ideas, suggestions, or feedback about Tapstagram, you agree that we may use, develop, and incorporate that feedback without restriction or compensation to you.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            14. Suspension and Termination
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            You may stop using Tapstagram at any time. We may suspend, restrict, or terminate your access to the platform, or remove your content, page, or account, at our discretion where we believe it is necessary for security, legal compliance, misuse prevention, operational reasons, or violation of these Terms.
                            <br />
                            <br />
                            Termination does not automatically remove all data immediately, and some information may be retained as described in our Privacy Policy or as required by law.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            15. Disclaimers
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            Tapstagram is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, Tapstagram disclaims all warranties, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, non-infringement, availability, security, or error-free operation.
                            <br />
                            <br />
                            We do not guarantee that the platform will always be available, uninterrupted, secure, accurate, or free from bugs, delays, or third-party failures.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            16. Limitation of Liability
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            To the fullest extent permitted by law, Tapstagram and its affiliates, owners, officers, employees, contractors, and partners will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including lost profits, lost business opportunities, lost data, reputational harm, or service interruption arising out of or related to your use of Tapstagram.
                            <br />
                            <br />
                            To the fullest extent permitted by law, Tapstagram’s total liability for any claim arising out of or relating to the service will not exceed the greater of:
                        </p>
                        <ul className="mt-2 px-4 space-y-2 text-sm leading-7 text-zinc-700">
                            <li>• the amount you paid to Tapstagram in the 12 months before the event giving rise to the claim, or</li>
                            <li>• 100 USD</li>
                        </ul>

                        <p className="mt-4 max-w-7xl text-sm leading-7 text-zinc-600">
                            Some jurisdictions do not allow certain limitations of liability, so parts of this section may not apply to you.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            17. Indemnification
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            You agree to defend, indemnify, and hold harmless Tapstagram and its affiliates, officers, employees, and service providers from and against claims, damages, liabilities, losses, and expenses arising from your content, your use of the service, your violation of these Terms, or your violation of any law or third-party rights.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            18. Governing Law and Disputes
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            These Terms are governed by the laws of the jurisdiction in which Tapstagram is organized and operated, unless applicable consumer law requires otherwise.
                            <br />
                            <br />
                            Any dispute arising out of or relating to these Terms or the use of Tapstagram will be resolved in the courts having jurisdiction over Tapstagram’s principal place of business, unless applicable law requires a different forum.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            19. Changes to These Terms
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            We may update these Terms from time to time. If we make material changes, we may post the updated Terms on our platform and revise the effective date. Your continued use of Tapstagram after the updated Terms take effect means that you agree to the revised Terms.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            20. Miscellaneous
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                            <br />
                            <br />
                            Our failure to enforce any provision of these Terms is not a waiver of that provision.
                            <br />
                            <br />
                            These Terms, together with our Privacy Policy and any additional service-specific terms, form the entire agreement between you and Tapstagram regarding your use of the platform.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                            21. Contact Us
                        </h2>
                        <p className="mt-3 max-w-7xl text-sm leading-7 text-zinc-600">
                            If you have questions about these Terms, you can contact us at:
                            <br />
                            <br />
                            <span className="font-medium text-zinc-800">Tapstagram</span>
                            <br />
                            Email: info@tapstagram.com
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        {/* keep your existing legal helper sections here if needed */}
                    </div>
                </div>
            </main>
        </LegalPageShell>
    );
}