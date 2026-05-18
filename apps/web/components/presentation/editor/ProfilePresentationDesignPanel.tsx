'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
    ChevronDown,
    LayoutTemplate,
    Palette,
    Blocks,
    ImageIcon,
    FileText,
    Phone,
    MousePointerClick,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/checkbox';
import ThemeEditor from '@/components/presentation/editor/ThemeEditor';
import BlocksManager from '@/components/presentation/editor/BlocksManager';
import ImageField from '@/components/presentation/editor/ImageField';
import ImageTextEditor from '@/components/presentation/editor/ImageTextEditor';
import { createId, updateBlockById } from '@/components/presentation/editor/utils';
import type { PresentationDocument } from '@/components/presentation/PresentationRenderer';

type Props = {
    doc: PresentationDocument;
    setDoc: Dispatch<SetStateAction<PresentationDocument | null>>;
    enabled: boolean;
    setEnabled: (v: boolean) => void;
    status: 'draft' | 'published';
    setStatus: (v: 'draft' | 'published') => void;
    template: string;
    setTemplate: (v: string) => void;
};

type SectionId =
    | 'general'
    | 'structure'
    | 'theme'
    | 'hero'
    | 'about'
    | 'contact'
    | 'cta'
    | 'extras';

function PanelSection({
    id,
    title,
    summary,
    icon: Icon,
    openId,
    setOpenId,
    children,
}: {
    id: SectionId;
    title: string;
    summary?: string;
    icon: any;
    openId: SectionId;
    setOpenId: (id: SectionId) => void;
    children: React.ReactNode;
}) {
    const open = openId === id;

    return (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpenId(id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-zinc-50"
            >
                <div className="min-w-0 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900">{title}</div>
                        {summary ? (
                            <div className="truncate text-xs text-zinc-500">{summary}</div>
                        ) : null}
                    </div>
                </div>

                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open ? <div className="border-t border-zinc-100 px-5 py-5">{children}</div> : null}
        </div>
    );
}

export default function ProfilePresentationDesignPanel({
    doc,
    setDoc,
    enabled,
    setEnabled,
    status,
    setStatus,
    template,
    setTemplate,
}: Props) {
    const [openId, setOpenId] = useState<SectionId>('general');

    const hero = useMemo(
        () => doc.blocks.find((b: any) => b.type === 'hero') as any,
        [doc.blocks]
    );
    const rich = useMemo(
        () => doc.blocks.find((b: any) => b.type === 'richText') as any,
        [doc.blocks]
    );
    const contact = useMemo(
        () => doc.blocks.find((b: any) => b.type === 'contact') as any,
        [doc.blocks]
    );
    const cta = useMemo(
        () => doc.blocks.find((b: any) => b.type === 'cta') as any,
        [doc.blocks]
    );
    const imageTextBlocks = useMemo(
        () => doc.blocks.filter((b: any) => b.type === 'imageText'),
        [doc.blocks]
    );

    const generalSummary = [
        template ? template.charAt(0).toUpperCase() + template.slice(1) : null,
        status === 'published' ? 'Published' : 'Draft',
        enabled ? 'Enabled' : 'Disabled',
    ]
        .filter(Boolean)
        .join(' · ');

    const structureSummary = `${doc.blocks.length} block${doc.blocks.length === 1 ? '' : 's'}`;

    const themeSummary = [
        doc.theme?.fontFamily || 'inter',
        doc.theme?.accentColor || '#3f3f46',
    ].join(' · ');

    const heroSummary = hero?.data?.headline || 'No headline set';
    const aboutSummary = rich?.data?.title || 'No section title';

    const contactFlags = [
        contact?.data?.showEmail ? 'Email' : null,
        contact?.data?.showPhone ? 'Phone' : null,
        contact?.data?.showLocation ? 'Location' : null,
    ]
        .filter(Boolean)
        .join(' · ');

    const contactSummary = [
        contact?.data?.title || 'Contact',
        contactFlags || 'No fields enabled',
    ].join(' · ');

    const ctaSummary = [
        cta?.data?.headline || 'CTA',
        cta?.data?.buttonText ? `Button: ${cta.data.buttonText}` : null,
    ]
        .filter(Boolean)
        .join(' · ');

    const extrasSummary =
        imageTextBlocks.length > 0
            ? `${imageTextBlocks.length} extra section${imageTextBlocks.length === 1 ? '' : 's'}`
            : 'No extra sections';

    return (
        <div className="space-y-4">
            <PanelSection
                id="general"
                title="General"
                summary={generalSummary}
                icon={LayoutTemplate}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label>Template</Label>
                        <Select value={template} onValueChange={setTemplate}>
                            <SelectTrigger className="h-11 rounded-2xl">
                                <SelectValue placeholder="Template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} />
                        <Label>Enable premium presentation</Label>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v: 'draft' | 'published') => setStatus(v)}>
                            <SelectTrigger className="h-11 rounded-2xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PanelSection>

            <PanelSection
                id="structure"
                title="Structure"
                summary={structureSummary}
                icon={Blocks}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <BlocksManager
                        blocks={doc.blocks || []}
                        onChange={(blocks) => setDoc((prev: any) => ({ ...prev, blocks }))}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setDoc((prev: any) => ({
                                ...prev,
                                blocks: [
                                    ...prev.blocks,
                                    {
                                        id: createId('imageText'),
                                        type: 'imageText',
                                        data: {
                                            title: 'New Section',
                                            text: '',
                                            imageUrl: '',
                                            imageSide: 'left',
                                            ctaText: '',
                                            ctaLink: '',
                                        },
                                    },
                                ],
                            }))
                        }
                        className="w-full rounded-2xl"
                    >
                        Add Image + Text Section
                    </Button>
                </div>
            </PanelSection>

            <PanelSection
                id="theme"
                title="Theme"
                summary={themeSummary}
                icon={Palette}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label>Max Width</Label>
                        <Select
                            value={doc?.theme?.maxWidth || '6xl'}
                            onValueChange={(v) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    theme: { ...prev.theme, maxWidth: v },
                                }))
                            }
                        >
                            <SelectTrigger className="h-11 rounded-2xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="4xl">4xl</SelectItem>
                                <SelectItem value="5xl">5xl</SelectItem>
                                <SelectItem value="6xl">6xl</SelectItem>
                                <SelectItem value="7xl">7xl</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Heading Size</Label>
                        <Select
                            value={doc?.theme?.headingSize || 'lg'}
                            onValueChange={(v) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    theme: { ...prev.theme, headingSize: v },
                                }))
                            }
                        >
                            <SelectTrigger className="h-11 rounded-2xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sm">Small</SelectItem>
                                <SelectItem value="md">Medium</SelectItem>
                                <SelectItem value="lg">Large</SelectItem>
                                <SelectItem value="xl">XL</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ThemeEditor
                        theme={doc.theme || {}}
                        onChange={(theme) => setDoc((prev: any) => ({ ...prev, theme }))}
                    />
                </div>
            </PanelSection>

            <PanelSection
                id="hero"
                title="Hero"
                summary={heroSummary}
                icon={ImageIcon}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label>Headline</Label>
                        <Input
                            value={hero?.data?.headline || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === hero.id ? { ...b, data: { ...b.data, headline: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Subheadline</Label>
                        <Input
                            value={hero?.data?.subheadline || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === hero.id ? { ...b, data: { ...b.data, subheadline: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Image URL</Label>
                        <ImageField
                            label="Hero Image"
                            value={hero?.data?.imageUrl || ''}
                            onChange={(url) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === hero.id ? { ...b, data: { ...b.data, imageUrl: url } } : b
                                    ),
                                }))
                            }
                        />

                        <Input
                            value={hero?.data?.imageUrl || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === hero.id ? { ...b, data: { ...b.data, imageUrl: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>
                </div>
            </PanelSection>

            <PanelSection
                id="about"
                title="About"
                summary={aboutSummary}
                icon={FileText}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label>Section Title</Label>
                        <Input
                            value={rich?.data?.title || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === rich.id ? { ...b, data: { ...b.data, title: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>HTML Content</Label>
                        <textarea
                            value={rich?.data?.html || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === rich.id ? { ...b, data: { ...b.data, html: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="min-h-[180px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                        />
                    </div>
                </div>
            </PanelSection>

            <PanelSection
                id="contact"
                title="Contact"
                summary={contactSummary}
                icon={Phone}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label>Section Title</Label>
                        <Input
                            value={contact?.data?.title || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === contact.id ? { ...b, data: { ...b.data, title: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Extra Text</Label>
                        <textarea
                            value={contact?.data?.extraText || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === contact.id ? { ...b, data: { ...b.data, extraText: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="min-h-[100px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={!!contact?.data?.showEmail}
                            onCheckedChange={(v) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === contact.id ? { ...b, data: { ...b.data, showEmail: !!v } } : b
                                    ),
                                }))
                            }
                        />
                        <Label>Show email</Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={!!contact?.data?.showPhone}
                            onCheckedChange={(v) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === contact.id ? { ...b, data: { ...b.data, showPhone: !!v } } : b
                                    ),
                                }))
                            }
                        />
                        <Label>Show phone</Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={!!contact?.data?.showLocation}
                            onCheckedChange={(v) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === contact.id ? { ...b, data: { ...b.data, showLocation: !!v } } : b
                                    ),
                                }))
                            }
                        />
                        <Label>Show location</Label>
                    </div>
                </div>
            </PanelSection>

            <PanelSection
                id="cta"
                title="CTA"
                summary={cta?.data?.headline || 'Call to action'}
                icon={MousePointerClick}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label>Headline</Label>
                        <Input
                            value={cta?.data?.headline || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === cta.id ? { ...b, data: { ...b.data, headline: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Text</Label>
                        <textarea
                            value={cta?.data?.text || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === cta.id ? { ...b, data: { ...b.data, text: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="min-h-[100px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Button Text</Label>
                        <Input
                            value={cta?.data?.buttonText || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === cta.id ? { ...b, data: { ...b.data, buttonText: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Button Link</Label>
                        <Input
                            value={cta?.data?.buttonLink || ''}
                            onChange={(e) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b: any) =>
                                        b.id === cta.id ? { ...b, data: { ...b.data, buttonLink: e.target.value } } : b
                                    ),
                                }))
                            }
                            className="h-11 rounded-2xl"
                        />
                    </div>
                </div>
            </PanelSection>

            <PanelSection
                id="extras"
                title="Extra Sections"
                summary={extrasSummary}
                icon={Blocks}
                openId={openId}
                setOpenId={setOpenId}
            >
                <div className="space-y-5">
                    {imageTextBlocks.map((block: any) => (
                        <ImageTextEditor
                            key={block.id}
                            block={block}
                            onChange={(nextBlock) =>
                                setDoc((prev: any) => ({
                                    ...prev,
                                    blocks: updateBlockById(prev.blocks, block.id, () => nextBlock),
                                }))
                            }
                        />
                    ))}

                    {imageTextBlocks.length === 0 ? (
                        <p className="text-sm text-zinc-500">No extra image + text sections added yet.</p>
                    ) : null}
                </div>
            </PanelSection>
        </div>
    );
}