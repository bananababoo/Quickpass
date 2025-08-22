export type NxLink = {
  name: string;
  link?: string;
  disabled?: boolean;
  show?: boolean;
  hasBorder?: boolean;
  showChildren?: boolean;
  children?: Links;
  bold?: boolean;
  group?: string;
};

export type NxLinks = Array<NxLink>;