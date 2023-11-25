import { has, get, unload, loadDecodeParse } from "../core/resourceMap";

export const decodeText = (data: { text: () => any }) => data.text();
export const parseText = (data: { text: () => any }) => data;
export const load = (path: string) => {
  return loadDecodeParse(path, decodeText, parseText);
};
export { has, get, unload };
