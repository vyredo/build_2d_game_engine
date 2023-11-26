import SimpleShader from "../shaders/SimpleShader.js";
import { text } from "../resources/index.js";
import { TextureShader } from "../shaders/textureShader.js";
import { pushPromise } from "./resourceMap.js";
import { SpriteShader } from "../shaders/SpriteShader.js";

// Simple Shader
const domain = "http://localhost:5173";

const kSimpleFS = "/shaders/simple_fs.glsl"; // Path to the simple FragmentShader
const kSimpleVS = "/shaders/simple_vs.glsl"; // Path to the simple FragmentShader
const kTextureVS = "/shaders/texture_vs.glsl"; // Path to the texture VertexShader
const kTextureFS = "/shaders/texture_fs.glsl"; // Path to the texture FragmentShader

export class ShaderResources {
  static mConstColorShader: SimpleShader | null = null;
  static mTextureShader: SimpleShader | null = null;
  static mSpriteShader: SpriteShader | null = null;

  static init() {
    const loadPromise = new Promise<void>(async (resolve) => {
      await Promise.all([text.load(kSimpleVS), text.load(kSimpleFS), text.load(kTextureVS), text.load(kTextureFS)]);
      resolve();
    }).then(() => {
      ShaderResources.createShaders();
    });

    pushPromise(loadPromise);
  }
  static cleanup() {
    ShaderResources.mConstColorShader?.cleanup();
    ShaderResources.mTextureShader?.cleanup();
    ShaderResources.mSpriteShader?.cleanup();

    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
  }
  static createShaders() {
    ShaderResources.mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    ShaderResources.mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    ShaderResources.mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
  }
  static getTextureShader = () => ShaderResources.mTextureShader;
  static getConstColorShader = () => ShaderResources.mConstColorShader;
  static getSpriteShader = () => ShaderResources.mSpriteShader;
}
