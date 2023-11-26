import { GLSys } from "../core/gl";
import { TextureShader } from "./textureShader";

let initTexCoord = [
  1.0,
  1.0, // top right
  0.0,
  1.0, // top left
  1.0,
  0.0, // bottom right
  0.0,
  0.0, // bottom left
];

export class SpriteShader extends TextureShader {
  mTexCoordBuffer: WebGLBuffer | null = null;

  constructor(vertexShaderPath: string, fragmentShaderPath: string) {
    super(vertexShaderPath, fragmentShaderPath);
    const gl = GLSys.getGL();
    this.mTexCoordBuffer = gl.createBuffer();

    if (!this.mTexCoordBuffer) {
      throw new Error("Failed to create texture coordinate buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.STATIC_DRAW);
  }

  setTextureCoordinate(texCoord: number[]) {
    const gl = GLSys.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
  }
  _getTexCoordBuffer(): WebGLBuffer | null {
    return this.mTexCoordBuffer;
  }
}
