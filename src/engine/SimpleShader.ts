import { mat4 } from "../lib/gl-matrix";
import { vertexBuffer } from "./core/VertexBuffer";
import { GLSys } from "./core/gl";

export class SimpleShader {
  private mCompiledShader: WebGLProgram | null = null;
  private mVertexPositionRef: GLuint | null = null;
  private mPixelColorRef: WebGLUniformLocation | null = null;
  private mModelMatrixRef: WebGLUniformLocation | null = null;
  private mCameraMatrixRef: WebGLUniformLocation | null = null;

  constructor(vertexShaderFilePath: string, fragmentShaderFilePath: string, { shouldFetch }: { shouldFetch?: boolean } = { shouldFetch: false }) {
    let vertexShader: WebGLShader;
    let fragmentShader: WebGLShader;
    const gl = GLSys.getGL();
    if (shouldFetch) {
      // fetch over the network
      vertexShader = this.loadAndCompileShaderFromFile(vertexShaderFilePath, gl.VERTEX_SHADER);
      fragmentShader = this.loadAndCompileShaderFromFile(fragmentShaderFilePath, gl.FRAGMENT_SHADER);
    } else {
      vertexShader = this.loadAndCompileShader(vertexShaderFilePath, gl.VERTEX_SHADER);
      fragmentShader = this.loadAndCompileShader(fragmentShaderFilePath, gl.FRAGMENT_SHADER);
    }
    this.init(vertexShader, fragmentShader);
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
    console.log("activate");
    console.log(this.mCompiledShader);

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

  loadAndCompileShader(shaderSource: string, shaderType: GLenum) {
    const gl = GLSys.getGL();

    // create shader object
    const shader = gl.createShader(shaderType);
    if (shader == null) throw new Error("Error creating shader");

    // load and compile shader source code
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // check for error
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  loadAndCompileShaderFromFile(filePath: string, shaderType: GLenum) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", filePath, false);
    try {
      xmlHttp.send();
    } catch (error) {
      throw new Error("Error loading shader file: " + filePath);
    }

    const shaderSource = xmlHttp.responseText;
    console.log(shaderSource);
    if (shaderSource == null) throw new Error("Error getting shader source from file: " + filePath);

    return this.loadAndCompileShader(shaderSource, shaderType);
  }
}

export default SimpleShader;
