import { Camera, TextureRenderable, texture } from "..";
import { ShaderResources } from "../core/ShaderResources";
import { SpriteShader } from "../shaders/SpriteShader";

export const eTexCoordArrayIndex = Object.freeze({
  eRight: 0,
  eTop: 1,
  eLeft: 2,
  eBottom: 5,
});

export class SpriteRenderable extends TextureRenderable {
  mElmLeft: number;
  mElmRight: number;
  mElmBottom: number;
  mElmTop: number;
  mTexture: string;

  constructor(myTexture: string) {
    super(myTexture);
    this.mTexture = myTexture;
    super._setShader(ShaderResources.getSpriteShader() as SpriteShader);

    // sprite coordinate
    this.mElmLeft = 0.0;
    this.mElmRight = 1.0;
    this.mElmBottom = 0.0;
    this.mElmTop = 1.0;
  }

  setElementUVCoordinate(left: number, right: number, bottom: number, top: number) {
    this.mElmLeft = left;
    this.mElmRight = right;
    this.mElmBottom = bottom;
    this.mElmTop = top;
  }

  setElementPixelPositions(left: number, right: number, bottom: number, top: number) {
    const texInfo = texture.get(this.mTexture);
    const imageW = texInfo.mWidth;
    const imageH = texInfo.mHeight;

    this.setElementUVCoordinate(left / imageW, right / imageW, bottom / imageH, top / imageH);
  }

  getElementUVCoordinateArray() {
    return [this.mElmRight, this.mElmTop, this.mElmLeft, this.mElmTop, this.mElmRight, this.mElmBottom, this.mElmLeft, this.mElmBottom];
  }

  draw(camera: Camera) {
    if (!this.mShader) throw new Error("Shader is null");
    const mShader = this.mShader as SpriteShader;
    mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
    super.draw(camera);
  }
}
