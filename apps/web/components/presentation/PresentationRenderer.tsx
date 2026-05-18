"use client";

import Link from "next/link";

type ThemeConfig = {
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    fontFamily?: "inter" | "system" | "serif";
    headingSize?: "sm" | "md" | "lg" | "xl";
    radius?: "md" | "lg" | "xl" | "2xl";
    maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
};

type HeroBlock = {
    id: string;
    type: "hero";
    data: {
        headline: string;
        subheadline?: string;
        ctaText?: string;
        ctaLink?: string;
        align?: "left" | "center";
        imageUrl?: string;
    };
};

type RichTextBlock = {
    id: string;
    type: "richText";
    data: {
        title?: string;
        html: string;
    };
};

type ContactBlock = {
    id: string;
    type: "contact";
    data: {
        title?: string;
        showEmail?: boolean;
        showPhone?: boolean;
        showLocation?: boolean;
        extraText?: string;
    };
};

type CtaBlock = {
    id: string;
    type: "cta";
    data: {
        headline: string;
        text?: string;
        buttonText?: string;
        buttonLink?: string;
    };
};

type CatalogBlock = {
    id: string;
    type: "catalog";
    data: {
        title?: string;
        items: Array<{
            id: string;
            title: string;
            text?: string;
            imageUrl?: string;
            link?: string;
        }>;
    };
};

type ImageTextBlock = {
    id: string;
    type: "imageText";
    data: {
        title?: string;
        text?: string;
        imageUrl?: string;
        imageSide?: "left" | "right";
        ctaText?: string;
        ctaLink?: string;
    };
};

type PresentationBlock =
    | HeroBlock
    | RichTextBlock
    | ContactBlock
    | CtaBlock
    | CatalogBlock
    | ImageTextBlock;

export type PresentationDocument = {
    version: 1;
    theme?: ThemeConfig;
    blocks: PresentationBlock[];
};

function wrapClass(maxWidth?: string) {
    switch (maxWidth) {
        case "4xl": return "max-w-4xl";
        case "5xl": return "max-w-5xl";
        case "6xl": return "max-w-6xl";
        case "7xl": return "max-w-7xl";
        default: return "max-w-6xl";
    }
}

function radiusClass(radius?: string) {
    switch (radius) {
        case "md": return "rounded-xl";
        case "lg": return "rounded-2xl";
        case "xl": return "rounded-3xl";
        case "2xl": return "rounded-[2rem]";
        default: return "rounded-3xl";
    }
}

function headingClass(size?: string) {
    switch (size) {
        case "sm": return "text-2xl md:text-3xl";
        case "md": return "text-3xl md:text-4xl";
        case "lg": return "text-4xl md:text-5xl";
        case "xl": return "text-5xl md:text-6xl";
        default: return "text-4xl md:text-5xl";
    }
}

function fontClass(font?: string) {
    switch (font) {
        case "serif": return "font-serif";
        case "system": return "font-sans";
        case "inter": return "font-sans";
        default: return "font-sans";
    }
}

function HeroBlockView({ block, theme }: { block: HeroBlock; theme?: ThemeConfig }) {
    const d = block.data;

    return (
        <section className="py-4">
            <div className={`mx-auto ${wrapClass(theme?.maxWidth)}`}>
                <div className={`${radiusClass(theme?.radius)} overflow-hidden border border-zinc-400 bg-white shadow-sm`}>
                    {d.imageUrl ? (
                        <div className="h-56 w-full overflow-hidden bg-zinc-100 md:h-72">
                            <img src={d.imageUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                    ) : null}

                    <div className={`p-8 md:p-12 ${d.align === "center" ? "text-center" : ""}`}>
                        <h1 className={`${headingClass(theme?.headingSize)} font-semibold tracking-tight text-zinc-900`}>
                            {d.headline}
                        </h1>

                        {d.subheadline ? (
                            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 md:text-lg">
                                {d.subheadline}
                            </p>
                        ) : null}

                        {d.ctaText && d.ctaLink ? (
                            <div className="mt-6">
                                <Link
                                    href={d.ctaLink}
                                    className="inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                                >
                                    {d.ctaText}
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

function RichTextBlockView({ block, theme }: { block: RichTextBlock; theme?: ThemeConfig }) {
    const d = block.data;

    return (
        <section className=" py-6">
            <div className={`mx-auto ${wrapClass(theme?.maxWidth)}`}>
                <div className={`${radiusClass(theme?.radius)} border border-zinc-400 bg-white p-8 shadow-sm`}>
                    {d.title ? (
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{d.title}</h2>
                    ) : null}

                    <div
                        className="prose prose-zinc mt-4 max-w-none"
                        dangerouslySetInnerHTML={{ __html: d.html || "<p></p>" }}
                    />
                </div>
            </div>
        </section>
    );
}

function ContactBlockView({
    block,
    theme,
    entity,
}: {
    block: ContactBlock;
    theme?: ThemeConfig;
    entity?: any;
}) {
    const d = block.data;

    return (
        <section id="contact" className=" py-6">
            <div className={`mx-auto ${wrapClass(theme?.maxWidth)}`}>
                <div className={`${radiusClass(theme?.radius)} border border-zinc-200 bg-white p-8 shadow-sm`}>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        {d.title || "Contact"}
                    </h2>

                    {d.extraText ? (
                        <p className="mt-3 text-sm leading-7 text-zinc-600">{d.extraText}</p>
                    ) : null}

                    <div className="mt-6 grid gap-3 text-sm text-zinc-700">
                        {d.showEmail && entity?.email ? <div>Email: {entity.email}</div> : null}
                        {d.showPhone && entity?.phone ? <div>Phone: {entity.phone}</div> : null}
                        {d.showLocation && entity?.location ? <div>Location: {entity.location}</div> : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CtaBlockView({ block, theme }: { block: CtaBlock; theme?: ThemeConfig }) {
    const d = block.data;

    return (
        <section className=" py-8">
            <div className={`mx-auto ${wrapClass(theme?.maxWidth)}`}>
                <div className={`${radiusClass(theme?.radius)} border border-zinc-200 bg-zinc-900 p-8 text-white shadow-sm`}>
                    <h2 className="text-2xl font-semibold tracking-tight">{d.headline}</h2>

                    {d.text ? (
                        <p className="mt-3 text-sm leading-7 text-zinc-300">{d.text}</p>
                    ) : null}

                    {d.buttonText && d.buttonLink ? (
                        <div className="mt-6">
                            <Link
                                href={d.buttonLink}
                                className="inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                            >
                                {d.buttonText}
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function CatalogBlockView({ block, theme }: { block: CatalogBlock; theme?: ThemeConfig }) {
    const d = block.data;

    return (
        <section className="px-6 py-6">
            <div className={`mx-auto ${wrapClass(theme?.maxWidth)}`}>
                <div className={`${radiusClass(theme?.radius)} border border-zinc-200 bg-white p-8 shadow-sm`}>
                    {d.title ? (
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{d.title}</h2>
                    ) : null}

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {(d.items || []).map((item) => (
                            <div key={item.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                                <div className="h-40 bg-zinc-100">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                                    {item.text ? <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p> : null}
                                    {item.link ? (
                                        <div className="mt-4">
                                            <Link href={item.link} className="text-sm font-medium text-zinc-900 hover:underline">
                                                Learn more
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ImageTextBlockView({ block, theme }: { block: ImageTextBlock; theme?: ThemeConfig }) {
    const d = block.data;
    const imageLeft = d.imageSide !== "right";

    return (
        <section className="px-2 py-6">
            <div className={`mx-auto ${wrapClass(theme?.maxWidth)}`}>
                <div className={`${radiusClass(theme?.radius)} grid overflow-hidden border border-zinc-200 bg-white shadow-sm md:grid-cols-2`}>
                    {imageLeft && (
                        <div className="h-72 bg-zinc-100">
                            {d.imageUrl ? <img src={d.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                    )}

                    <div className="p-8 md:p-10">
                        {d.title ? <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{d.title}</h2> : null}
                        {d.text ? <p className="mt-4 text-sm leading-7 text-zinc-600">{d.text}</p> : null}
                        {d.ctaText && d.ctaLink ? (
                            <div className="mt-6">
                                <Link
                                    href={d.ctaLink}
                                    className="inline-flex rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    {d.ctaText}
                                </Link>
                            </div>
                        ) : null}
                    </div>

                    {!imageLeft && (
                        <div className="h-72 bg-zinc-100">
                            {d.imageUrl ? <img src={d.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function PresentationRenderer({
    document,
    entity,
}: {
    document: PresentationDocument;
    entity?: any;
}) {
    const theme = document?.theme || {};

    return (
        <div
            className={fontClass(theme.fontFamily)}
            style={{
                backgroundColor: theme.bgColor || "#ffffff",
                color: theme.textColor || "#18181b",
            }}
        >
            {(document?.blocks || []).map((block) => {
                switch (block.type) {
                    case "hero":
                        return <HeroBlockView key={block.id} block={block} theme={theme} />;
                    case "richText":
                        return <RichTextBlockView key={block.id} block={block} theme={theme} />;
                    case "contact":
                        return <ContactBlockView key={block.id} block={block} theme={theme} entity={entity} />;
                    case "cta":
                        return <CtaBlockView key={block.id} block={block} theme={theme} />;
                    case "catalog":
                        return <CatalogBlockView key={block.id} block={block} theme={theme} />;
                    case "imageText":
                        return <ImageTextBlockView key={block.id} block={block} theme={theme} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}