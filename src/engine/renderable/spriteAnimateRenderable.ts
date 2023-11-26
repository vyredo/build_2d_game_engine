import { Camera, SpriteRenderable, texture } from "..";
import { ShaderResources } from "../core/ShaderResources";
import { SpriteShader } from "../shaders/SpriteShader";

export enum eAnimationType {
  eRight = 0,
  eLeft = 1,
  eSwing = 2,
}

export class SpriteAnimateRenderable extends SpriteRenderable {
  mFirstElmLeft: number = 0.0;
  mElmTop = 1.0;
  mElmWidth = 1.0;
  mElmHeight = 1.0;
  mWidthPadding = 0.0;
  mNumElems = 1; // number of elements in an animation

  // per animation settings
  mUpdateInterval = 1;
  mAnimationType: eAnimationType = eAnimationType.eRight;

  mCurrentAnimAdvance = -1; // either 1 or -1
  mCurrentElm = 0;
  mCurrentTick = 0;

  constructor(myTexture: string) {
    super(myTexture);
    super._setShader(ShaderResources.getSpriteShader() as SpriteShader);

    // All coordinates are in texture coordinate (UV between 0 to 1)
    this._initAnimation();
  }

  _initAnimation() {
    this.mCurrentTick = 0;
    switch (this.mAnimationType) {
      case eAnimationType.eRight:
        this.mCurrentElm = 0;
        this.mCurrentAnimAdvance = 1;
        break;
      case eAnimationType.eSwing:
        this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance;
        this.mCurrentElm += 2 * this.mCurrentAnimAdvance;
        break;
      case eAnimationType.eLeft:
        this.mCurrentElm = this.mNumElems - 1;
        this.mCurrentAnimAdvance = -1; // either 1 or -1
        break;
    }
    this._setSpriteElement();
  }

  _setSpriteElement() {
    let left = this.mFirstElmLeft + this.mCurrentElm * (this.mElmWidth + this.mWidthPadding);
    super.setElementUVCoordinate(left, left + this.mElmWidth, this.mElmTop - this.mElmHeight, this.mElmTop);
  }

  setAnimationType(animationType: eAnimationType) {
    this.mAnimationType = animationType;
    this.mCurrentAnimAdvance = -1;
    this.mCurrentElm = 0;
    this._initAnimation();
  }

  setSpriteSequence(
    topPixel: number, // offset from top-left
    leftPixel: number, // offset from top-left
    elmWidthInPixel: number,
    elmHeightInPixel: number,
    numElements: number, // number of elements in sequence
    wPaddingInPixel: number // left/right padding
  ) {
    let texInfo = texture.get(this.mTexture);
    // entire image width, height
    let imageW = texInfo.mWidth;
    let imageH = texInfo.mHeight;
    this.mNumElems = numElements; // number of elements in animation
    this.mFirstElmLeft = leftPixel / imageW;
    this.mElmTop = topPixel / imageH;
    this.mElmWidth = elmWidthInPixel / imageW;
    this.mElmHeight = elmHeightInPixel / imageH;
    this.mWidthPadding = wPaddingInPixel / imageW;
    this._initAnimation();
  }
  setAnimationSpeed(tickInterval: number) {
    this.mUpdateInterval = tickInterval;
  }
  incAnimationSpeed(deltaInterval: number) {
    this.mUpdateInterval += deltaInterval;
  }
  updateAnimation() {
    this.mCurrentTick++;
    if (this.mCurrentTick >= this.mUpdateInterval) {
      this.mCurrentTick = 0;
      this.mCurrentElm += this.mCurrentAnimAdvance;
      if (this.mCurrentElm >= 0 && this.mCurrentElm < this.mNumElems) {
        this._setSpriteElement();
      } else {
        this._initAnimation();
      }
    }
  }
}
