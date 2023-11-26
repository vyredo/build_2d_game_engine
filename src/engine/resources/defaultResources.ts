import { pushPromise } from "../core/resourceMap";
import font from "./font";

const kDefaultFont = "/assets/fonts/system-default-font";

class DefaultResources {
  init() {
    const loadPromise = new Promise<void>(async function (resolve) {
      await Promise.all([font.load(kDefaultFont)]);
      resolve();
    }).then(function resolve() {
      /* nothing to do for font */
    });
    pushPromise(loadPromise);
  }

  cleanup() {
    font.unload(kDefaultFont);
  }

  getDefaultFontName() {
    return kDefaultFont;
  }
}

export default new DefaultResources();
