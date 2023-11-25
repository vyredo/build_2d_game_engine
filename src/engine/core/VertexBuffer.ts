import { GLSys } from "./gl";

let mVerticesOfSquare = [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0];
class VertexBuffer {
  private mGLVertextBuffer: WebGLBuffer | null = null;

  constructor() {
    this.mGLVertextBuffer = null;
  }

  cleanup() {
    if (this.mGLVertextBuffer == null) throw new Error("Error getting vertex buffer");
    GLSys.getGL().deleteBuffer(this.mGLVertextBuffer);
    this.mGLVertextBuffer = null;
  }

  get() {
    return this.mGLVertextBuffer;
  }

  init() {
    let gl = GLSys.getGL();
    this.mGLVertextBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mGLVertextBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
  }
}

export const vertexBuffer = new VertexBuffer();
