// general utilities
import { vertexBuffer } from "./core/VertexBuffer";
import { GLSys } from "./core/gl";
import Renderable from "./renderable";
import { ShaderResources } from "./core/ShaderResources";
import { Transform } from "./transform";
import Camera from "./camera";
import input from "./input";
import { text, xml } from "./resources";
import Scene from "./scene";
import loop from "./core/loop";
import * as map from "./core/resourceMap";
import audio from "./resources/audio";

// general engine utilities
function init(htmlCanvasID: string) {
  GLSys.init(htmlCanvasID);
  vertexBuffer.init();
  ShaderResources.init();
  input.init();
  audio.init();
}

function clearCanvas(color: [number, number, number, number]) {
  let gl = GLSys.getGL();
  gl.clearColor(...color); // set the color to be cleared
  gl.clear(gl.COLOR_BUFFER_BIT); // clear to the color previously set
}

function cleanup() {
  loop.cleanup();
  audio.cleanup();
  input.cleanup();
  ShaderResources.cleanup();
  vertexBuffer.cleanup();
  GLSys.cleanup();
}

export { audio, map, cleanup, Renderable, init, clearCanvas, Transform, Camera, input, text, xml, Scene };
