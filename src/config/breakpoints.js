

export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const wideQ = matchMedia("(min-width:1024px)");
export const isWide = () => wideQ.matches;
