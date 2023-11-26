import { mat4 } from "../../lib/gl-matrix";
import SimpleShader from "./SimpleShader";
import { GLSys } from "../core/gl";
import { vertexBuffer } from "../core/VertexBuffer";

export class TextureShader extends SimpleShader {
  mTextureCoordinateRef = 0;
  mSamplerRef: WebGLUniformLocation | null = null;

  constructor(vertexShaderPath: string, fragmentShaderPath: string) {
    super(vertexShaderPath, fragmentShaderPath);
    if (!this.mCompiledShader) throw new Error("Error getting compiled shader");

    // get the reference of aTextureCoordinate within the shader
    const gl = GLSys.getGL();
    this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
    this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
  }
  _getTexCoordBuffer() {
    return vertexBuffer.getTexCoord();
  }

  activate(pixelColor: number[], trsMatrix: mat4.mat4, cameraMatrix: mat4.mat4) {
    super.activate(pixelColor, trsMatrix, cameraMatrix);

    // enable texture coordinate array
    const gl = GLSys.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
    gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.mTextureCoordinateRef);

    // bind uSmapler to texture unit 0
    gl.uniform1i(this.mSamplerRef, 0);
  }
}
