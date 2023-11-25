import SimpleShader from "../SimpleShader";
import { fragmentShaderSource } from "../../shaders/simple_fs";
import { vertexShaderSource } from "../../shaders/simple_vs.js";

// Simple Shader
let kSimpleVS = vertexShaderSource; // Path to the VertexShader
let kSimpleFS = fragmentShaderSource; // Path to the simple FragmentShader

export class ShaderResources {
  static mConstColorShader: SimpleShader | null = null;
  static init() {
    console.log("does init called");
    ShaderResources.createShaders();
    console.log(ShaderResources.mConstColorShader);
  }

  static createShaders() {
    ShaderResources.mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
  }
  static getConstColorShader() {
    return ShaderResources.mConstColorShader;
  }
}
