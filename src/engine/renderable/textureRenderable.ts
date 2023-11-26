import { Camera, Renderable } from "..";
import { ShaderResources } from "../core/ShaderResources";
import texture from "../resources/texture";

export class TextureRenderable extends Renderable {
  mTexture: string;
  constructor(myTexture: string) {
    super();
    super.setColor([1, 1, 1, 0]); // Alpha 0: switch off tinting
    super._setShader(ShaderResources.getTextureShader());
    this.mTexture = myTexture;
  }

  draw(camera: Camera) {
    //activate the texture
    texture.activate(this.mTexture);
    super.draw(camera);
  }

  getTexture() {
    return this.mTexture;
  }
  setTexture(t: string) {
    this.mTexture = t;
  }
}
