'use client';
import React from 'react';
import { recordSocialClick, recordProjectClick } from '@/services/analytics';

type Props = React.PropsWithChildren<{
    href: string;
    profileId: number;
    kind: 'social' | 'project';
    linkId: number; // socialLinkId or projectLinkId
    className?: string;
}>;

export default function TrackedLink({ href, profileId, kind, linkId, className, children }: Props) {
    const onClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        // let default open in new tab unless you want same-tab
        // you can remove preventDefault to rely on natural navigation
        // keeping it natural but still firing fetch is fine
        if (kind === 'social') recordSocialClick(profileId, linkId);
            else recordProjectClick(profileId, linkId);
        // no await — fire-and-forget
    };
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
            {children}
        </a>
    );
}
