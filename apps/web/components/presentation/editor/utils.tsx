export function moveItem<T>(items: T[], from: number, to: number): T[] {
    const copy = [...items];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
}

export function updateBlockById<T extends { id: string }>(
    blocks: T[],
    id: string,
    updater: (block: T) => T
): T[] {
    return blocks.map((b) => (b.id === id ? updater(b) : b));
}

export function removeBlockById<T extends { id: string }>(blocks: T[], id: string): T[] {
    return blocks.filter((b) => b.id !== id);
}

export function createId(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}