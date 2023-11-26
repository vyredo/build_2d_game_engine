import { GLSys } from "./gl";

let mVerticesOfSquare = [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0];
let mTextureCoordinates = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
class VertexBuffer {
  private mGLVertextBuffer: WebGLBuffer | null = null;
  private mGLTextureCoordBuffer: WebGLBuffer | null = null;
  constructor() {}
  getTexCoord = () => this.mGLTextureCoordBuffer;

  cleanup() {
    if (this.mGLVertextBuffer != null) {
      GLSys.getGL().deleteBuffer(this.mGLVertextBuffer);
      this.mGLVertextBuffer = null;
    }

    if (this.mGLTextureCoordBuffer != null) {
      GLSys.getGL().deleteBuffer(this.mGLTextureCoordBuffer);
      this.mGLTextureCoordBuffer = null;
    }
  }
  get = () => this.mGLVertextBuffer;

  init() {
    let gl = GLSys.getGL();
    this.mGLVertextBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mGLVertextBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);

    // Create and store texture coordinates
    this.mGLTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mGLTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);
  }
}

export const vertexBuffer = new VertexBuffer();
