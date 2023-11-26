import { Camera, SpriteRenderable, Transform } from "..";
import defaultResources from "../resources/defaultResources";
import font from "../resources/font";

export class FontRenderable {
  mFontName = defaultResources.getDefaultFontName();
  mOneChar = new SpriteRenderable(font.imageName(this.mFontName));
  mXform = new Transform(); // transform that moves this object around
  mText = ""; // text to be displayed

  constructor(aString: string) {
    this.mText = aString;
  }

  draw(camera: Camera) {
    // we will draw the text string by calling to mOneChar for each of the
    // chars in the mText string.
    let widthOfOneChar = this.mXform.getWidth() / this.mText.length;
    let heightOfOneChar = this.mXform.getHeight();
    // this.mOneChar.getXform().SetRotationInRad(this.mXform.getRotationInRad());
    let yPos = this.mXform.getYpos();

    // center position of the first char
    let xPos = this.mXform.getXpos() - widthOfOneChar / 2 + widthOfOneChar * 0.5;

    for (let charIndex = 0; charIndex < this.mText.length; charIndex++) {
      const aChar = this.mText.charCodeAt(charIndex);
      const charInfo = font.getCharInfo(this.mFontName, aChar);

      if (!charInfo) continue;

      // set the texture coordinate
      this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight, charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

      // now the size of the char
      const xSize = widthOfOneChar * charInfo.mCharWidth;
      const ySize = heightOfOneChar * charInfo.mCharHeight;
      this.mOneChar.getXform().setSize(xSize, ySize);

      // how much to offset from the center
      const xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
      const yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

      this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

      this.mOneChar.draw(camera);

      xPos += widthOfOneChar;
    }
  }

  getXform() {
    return this.mXform;
  }
  getText() {
    return this.mText;
  }
  setText(t: string) {
    this.mText = t;
    this.setTextHeight(this.getXform().getHeight());
  }

  setTextHeight(h: number) {
    const charInfo = font.getCharInfo(this.mFontName, "A".charCodeAt(0)); // this is for "A"
    if (!charInfo) return;
    const w = h * charInfo.mCharAspectRatio;
    this.getXform().setSize(w * this.mText.length, h);
  }

  getFontName() {
    return this.mFontName;
  }
  setFontName(f: string) {
    this.mFontName = f;
    this.mOneChar.setTexture(font.imageName(this.mFontName));
  }

  setColor(c: [number, number, number, number]) {
    this.mOneChar.setColor(c);
  }
  getColor() {
    return this.mOneChar.getColor();
  }

  update() {}

  /*
     * this can be a potentially useful function. Not included/tested in this version of the engine

    getStringWidth(h) {
        let stringWidth = 0;
        let charSize = h;
        let charIndex, aChar, charInfo;
        for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
            aChar = this.mText.charCodeAt(charIndex);
            charInfo = font.getCharInfo(this.mFont, aChar);
            stringWidth += charSize * charInfo.mCharWidth * charInfo.mXAdvance;
        }
        return stringWidth;
    }
    */
}
