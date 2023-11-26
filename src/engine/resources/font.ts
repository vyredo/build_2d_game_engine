import { text, xml } from ".";
import { texture } from "..";

const kDescExt = ".fnt";
const kImageExt = ".png";

class CharacterInfo {
  mTexCoordLeft = 0;
  mTexCoordRight = 1;
  mTexCoordBottom = 0;
  mTexCoordTop = 0;

  // nominal char size, 1 is standard w/h of a char
  mCharWidth = 1;
  mCharHeight = 1;
  mCharWidthOffset = 0;
  mCharHeightOffset = 0;

  // reference of char w/h ratio
  mCharAspectRatio = 1;

  constructor() {}

  descName(fontName: string) {
    return fontName + kDescExt;
  }

  imageName(fontName: string) {
    return fontName + kImageExt;
  }

  load(fontName: string) {
    xml.load(this.descName(fontName));
    text.load(this.imageName(fontName));
  }

  unload(fontName: string) {
    xml.unload(this.descName(fontName));
    text.unload(this.imageName(fontName));
  }

  has(fontName: string) {
    return xml.has(this.descName(fontName)) && text.has(this.imageName(fontName));
  }

  getCharInfo(fontName: string, aChar: number) {
    let returnInfo = null;
    let fontInfo = xml.get(this.descName(fontName));
    let commonPath = "font/common";
    let commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    commonInfo = commonInfo.iterateNext();
    if (commonInfo === null) {
      return returnInfo;
    }
    let charHeight = commonInfo.getAttribute("base");

    let charPath = "font/chars/char[@id=" + aChar + "]";
    let charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    charInfo = charInfo.iterateNext();

    if (charInfo === null) {
      return returnInfo;
    }

    returnInfo = new CharacterInfo();
    let texInfo = texture.get(this.imageName(fontName));
    let leftPixel = Number(charInfo.getAttribute("x"));
    let rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
    let topPixel = texInfo.mHeight - 1 - Number(charInfo.getAttribute("y"));
    let bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

    // texture coordinate information
    returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth - 1);
    returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight - 1);
    returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth - 1);
    returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight - 1);

    // relative character size
    let charWidth = charInfo.getAttribute("xadvance");
    returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
    returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
    returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
    returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
    returnInfo.mCharAspectRatio = charWidth / charHeight;

    return returnInfo;
  }
}

export default new CharacterInfo();
