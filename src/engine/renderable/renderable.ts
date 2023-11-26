import { GLSys } from "../core/gl";
import { ShaderResources } from "../core/ShaderResources";
import { Transform } from "../transform";
import { Camera } from "..";
import type SimpleShader from "../shaders/SimpleShader";
import type { TextureShader } from "../shaders/textureShader";
import type { SpriteShader } from "../shaders/SpriteShader";

class Renderable {
  mShader: SimpleShader | TextureShader | SpriteShader | null = ShaderResources.getConstColorShader(); // the shader for shading this object
  mColor: number[] = [1, 1, 1, 1]; // color of pixel
  mXform: Transform = new Transform(); // transform operator
  constructor() {}
  draw(camera: Camera) {
    let gl = GLSys.getGL();
    if (this.mShader == null) throw new Error("Error getting shader");
    this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  setColor(color: [number, number, number, number]) {
    this.mColor = color;
  }
  getColor() {
    return this.mColor;
  }
  getXform() {
    return this.mXform;
  }
  _setShader(shader: SimpleShader | TextureShader | SpriteShader) {
    this.mShader = shader;
  }
}

export default Renderable;
