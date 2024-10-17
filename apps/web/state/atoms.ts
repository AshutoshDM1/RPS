import { atom } from "recoil";

export const isLoading = atom<boolean>({
  key: "isLoading",
  default: false,
});

export const valueAtom = atom<string>({
  key: "value",
  default: "",
});
