import SimpleShader from "../SimpleShader";
import { text } from "../resources/index.js";
import { pushPromise } from "./resourceMap.js";

// Simple Shader
const domain = "http://localhost:5173";

const kSimpleFS = "/shaders/simple_fs.glsl"; // Path to the simple FragmentShader
const kSimpleVS = "/shaders/simple_vs.glsl"; // Path to the simple FragmentShader

export class ShaderResources {
  static mConstColorShader: SimpleShader | null = null;
  static init() {
    const loadPromise = new Promise<void>(async (resolve) => {
      await Promise.all([text.load(kSimpleVS), text.load(kSimpleFS)]);
      resolve();
    }).then(() => {
      ShaderResources.createShaders();
    });

    pushPromise(loadPromise);
  }
  static cleanup() {
    ShaderResources.mConstColorShader?.cleanup();
    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
  }
  static createShaders() {
    ShaderResources.mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
  }
  static getConstColorShader() {
    return ShaderResources.mConstColorShader;
  }
}
