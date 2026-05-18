export type ThemeConfig = {
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: "inter" | "system" | "serif";
  headingSize?: "sm" | "md" | "lg" | "xl";
  radius?: "md" | "lg" | "xl" | "2xl";
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
};

export type HeroBlock = {
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

export type RichTextBlock = {
  id: string;
  type: "richText";
  data: {
    title?: string;
    html: string;
  };
};

export type ImageTextBlock = {
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

export type CatalogBlock = {
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

export type ContactBlock = {
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

export type CtaBlock = {
  id: string;
  type: "cta";
  data: {
    headline: string;
    text?: string;
    buttonText?: string;
    buttonLink?: string;
  };
};

export type PresentationBlock =
  | HeroBlock
  | RichTextBlock
  | ImageTextBlock
  | CatalogBlock
  | ContactBlock
  | CtaBlock;

export type PresentationDocument = {
  version: 1;
  theme?: ThemeConfig;
  blocks: PresentationBlock[];
};