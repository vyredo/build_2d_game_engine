import { GLSys } from "../core/gl";
import * as map from "../core/resourceMap";
// { has, get, set, unload, loadDecodeParse, incRef, loadRequested, pushPromise, mOutstandingPromises } from "../core/resourceMap";

class TextureInfo {
  mWidth: number;
  mHeight: number;
  mGLTexID: WebGLTexture;
  constructor(w: number, h: number, id: WebGLTexture) {
    this.mWidth = w;
    this.mHeight = h;
    this.mGLTexID = id;
  }
}

let attempt = 0;

class Texture {
  has = map.has;
  get = map.get;
  processLoadedImage(path: string, image: HTMLImageElement) {
    console.log("processLoadedImage", path, image);
    const gl = GLSys.getGL();

    const textureID = gl.createTexture();
    if (!textureID) throw new Error("Error creating texture");
    gl.bindTexture(gl.TEXTURE_2D, textureID);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Creates a mipmap for this texture.
    gl.generateMipmap(gl.TEXTURE_2D);

    // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
    gl.bindTexture(gl.TEXTURE_2D, null);

    let texInfo = new TextureInfo(image.naturalWidth, image.naturalHeight, textureID);
    map.set(path, texInfo);
  }

  load(textureName: string) {
    let texturePromise = null;
    if (map.has(textureName)) {
      map.incRef(textureName);
    } else {
      map.loadRequested(textureName);

      const image = new Image();
      texturePromise = new Promise((resolve) => {
        image.onload = resolve;
        image.src = textureName;
      }).then(() => this.processLoadedImage(textureName, image));
      map.pushPromise(texturePromise);
    }

    return texturePromise;
  }

  unload(textureName: string) {
    const texInfo = map.get(textureName);
    if (map.unload(textureName)) {
      const gl = GLSys.getGL();
      gl.deleteTexture(texInfo.id);
    }
  }
  activate(textureName: string) {
    // console.log(`Activating texture ${textureName}`);
    // console.log(has(textureName));
    const gl = GLSys.getGL();
    const texInfo = map.get(textureName);
    // Binds our texture reference to the current webGL texture functionality
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

    // To prevent texture wrappings
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Handles how magnification and minimization filters will work.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    // For pixel-graphics where you want the texture to look "sharp" do the following:
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }

  deactivate() {
    const gl = GLSys.getGL();
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

export default new Texture();
