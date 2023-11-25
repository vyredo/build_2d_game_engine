import { GLSys } from "./core/gl";
import { ShaderResources } from "./core/ShaderResources";
import { Transform } from "./transform";
import { Camera } from ".";

class Renderable {
  mShader = ShaderResources.getConstColorShader(); // the shader for shading this object
  mColor: number[] = [1, 1, 1, 1]; // color of pixel
  mXform: Transform = new Transform(); // transform operator

  draw(camera: Camera) {
    let gl = GLSys.getGL();
    if (!this.mShader) throw new Error("Error getting shader");
    this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  setColor = (color: [number, number, number, number]) => (this.mColor = color);
  getColor = () => this.mColor;
  getXform = () => this.mXform;
}

export default Renderable;
