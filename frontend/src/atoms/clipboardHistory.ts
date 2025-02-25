import { atomWithStorage } from "jotai/utils";

export type ClipboardHistory = {
  format: "text" | "image"; // TODO: support file etc.
  hash: string;
  content: string;
  isPinned: boolean;
};

export const ClipboardContentFormatMap: {
  [key: number]: ClipboardHistory["format"];
} = {
  // Refer to golang.design/x/clipboard
  0: "text",
  1: "image",
};

export const ClipboardContentFormatReverseMap: {
  [key: string]: number;
} = {
  // Refer to golang.design/x/clipboard
  text: 0,
  image: 1,
};

export const clipboardHistoryAtom = atomWithStorage<ClipboardHistory[]>(
  "clipboardHistory",
  [
    {
      format: "text",
      hash: "11075edad715128056f6269c1c38376c",
      content: "PeerClip",
      isPinned: false,
    },
    {
      format: "text",
      hash: "ff3f45851001d1cc9f162cd4f0e1ba62",
      content: "Made with ❤ by Nya Candy",
      isPinned: true,
    },
  ],
  undefined,
  {
    getOnInit: true,
  },
);
