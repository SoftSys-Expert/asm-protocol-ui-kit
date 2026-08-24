/**
 * Histoire vanilla story types
 */

export interface HistoireVanillaState {
  [key: string]: unknown;
}

export interface HistoireVanillaVariant {
  el: HTMLElement;
  state: HistoireVanillaState;
  onUpdate: (callback: () => void | Promise<void>) => void;
  onUnmount: (callback: () => void | Promise<void>) => void;
}

export interface HistoireVanillaStoryVariant {
  id?: string;
  title?: string;
  icon?: string;
  iconColor?: string;
  onMount?: (api: HistoireVanillaVariant) => void | Promise<void>;
  onMountControls?: (api: HistoireVanillaVariant) => void | Promise<void>;
}

export interface HistoireVanillaStory {
  id?: string;
  title?: string;
  group?: string;
  layout?: { type: string; iframe?: boolean };
  icon?: string;
  iconColor?: string;
  docsOnly?: boolean;
  onMount?: (api: HistoireVanillaVariant) => void | Promise<void>;
  onMountControls?: (api: HistoireVanillaVariant) => void | Promise<void>;
  variants?: HistoireVanillaStoryVariant[];
}

declare module "*.story.ts" {
  const story: HistoireVanillaStory;
  export default story;
}

declare module "*.story.js" {
  const story: HistoireVanillaStory;
  export default story;
}
