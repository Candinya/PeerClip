import { atomWithStorage } from "jotai/utils";

export type ClipboardHistory = {
  type: "text"; // TODO: support image and file etc.
  hash: string;
  content: string;
  isPinned: boolean;
};

export const clipboardHistoryAtom = atomWithStorage<ClipboardHistory[]>(
  "clipboardHistory",
  [],
  undefined,
  {
    getOnInit: true,
  },
);
