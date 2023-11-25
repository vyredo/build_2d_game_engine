import { mat4 } from "../lib/gl-matrix";
import { vertexBuffer } from "./core/VertexBuffer";
import { GLSys } from "./core/gl";
import { text } from "./resources";

export class SimpleShader {
  private mCompiledShader: WebGLProgram | null = null;
  private mVertexPositionRef: GLuint | null = null;
  private mPixelColorRef: WebGLUniformLocation | null = null;
  private mModelMatrixRef: WebGLUniformLocation | null = null;
  private mCameraMatrixRef: WebGLUniformLocation | null = null;
  private mVertexShader: WebGLShader | null = null;
  private mFragmentShader: WebGLShader | null = null;

  constructor(vertexShaderFilePath: string, fragmentShaderFilePath: string) {
    const gl = GLSys.getGL();

    this.mVertexShader = this.compileShader(vertexShaderFilePath, gl.VERTEX_SHADER);
    this.mFragmentShader = this.compileShader(fragmentShaderFilePath, gl.FRAGMENT_SHADER);
    this.init(this.mVertexShader, this.mFragmentShader);
  }

  cleanup() {
    const gl = GLSys.getGL();
    if (!this.mCompiledShader) throw new Error("Error getting compiled shader");
    if (!this.mVertexShader) throw new Error("Error getting vertex shader");
    if (!this.mFragmentShader) throw new Error("Error getting fragment shader");

    gl.detachShader(this.mCompiledShader, this.mVertexShader);
    gl.detachShader(this.mCompiledShader, this.mFragmentShader);
    gl.deleteShader(this.mVertexShader);
    gl.deleteShader(this.mFragmentShader);
    gl.deleteProgram(this.mCompiledShader);
  }

  init(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const gl = GLSys.getGL();

    // reate and link the shader to program
    this.mCompiledShader = gl.createProgram();
    if (!this.mCompiledShader) throw new Error("Error creating shader program");

    gl.attachShader(this.mCompiledShader, vertexShader);
    gl.attachShader(this.mCompiledShader, fragmentShader);
    gl.linkProgram(this.mCompiledShader);

    // check for error
    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
      throw new Error("Error linking shader program: " + gl.getProgramInfoLog(this.mCompiledShader));
    }

    // get reference of vertex shader's position attribute
    this.mVertexPositionRef = gl.getAttribLocation(this.mCompiledShader, "aVertexPosition");
    this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
    this.mModelMatrixRef = gl.getUniformLocation(this.mCompiledShader, "uModelXformMatrix");
    this.mCameraMatrixRef = gl.getUniformLocation(this.mCompiledShader, "uCameraXformMatrix");
  }

  activate(pixelColor: Iterable<number>, trsMatrix: mat4.mat4, cameraMatrix: mat4.mat4) {
    if (this.mVertexPositionRef == null) throw new Error("Error getting vertex position reference");

    const gl = GLSys.getGL();

    gl.useProgram(this.mCompiledShader);

    // connect the buffer to the vertexPosition attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
    gl.vertexAttribPointer(this.mVertexPositionRef, 3, gl.FLOAT, false, 0, 0);
    // enable vertex position attribute
    gl.enableVertexAttribArray(this.mVertexPositionRef);

    // load uniforms
    gl.uniform4fv(this.mPixelColorRef, pixelColor);
    gl.uniformMatrix4fv(this.mModelMatrixRef, false, trsMatrix);
    gl.uniformMatrix4fv(this.mCameraMatrixRef, false, cameraMatrix);
  }

  compileShader(filePath: string, shaderType: GLenum) {
    const gl = GLSys.getGL();

    const shaderSource = text.get(filePath);

    // create shader object
    const shader = gl.createShader(shaderType);
    if (shader == null) throw new Error(`Error creating shader ${shaderSource}`);

    // load and compile shader source code
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // check for error
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }

    return shader;
  }
}

export default SimpleShader;
