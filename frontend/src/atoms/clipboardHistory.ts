import { atomWithStorage } from "jotai/utils";

export type ClipboardHistory = {
  type: "text"; // TODO: support image and file etc.
  hash: string;
  content: string;
  isPinned: boolean;
};

export const clipboardHistoryAtom = atomWithStorage<ClipboardHistory[]>(
  "clipboardHistory",
  [
    {
      type: "text",
      hash: "11075edad715128056f6269c1c38376c",
      content: "PeerClip",
      isPinned: false,
    },
    {
      type: "text",
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
