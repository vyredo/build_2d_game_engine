// general utilities
import { vertexBuffer } from "./core/VertexBuffer";
import { GLSys } from "./core/gl";
import Renderable from "./renderable";
import { ShaderResources } from "./core/ShaderResources";
import { Transform } from "./transform";
import Camera from "./camera";

// general engine utilities
function init(htmlCanvasID: string) {
  GLSys.init(htmlCanvasID);
  vertexBuffer.init();
  ShaderResources.init();
  console.log(ShaderResources.getConstColorShader());
}

function clearCanvas(color: [number, number, number, number]) {
  let gl = GLSys.getGL();
  gl.clearColor(...color); // set the color to be cleared
  gl.clear(gl.COLOR_BUFFER_BIT); // clear to the color previously set
}

export { Renderable, init, clearCanvas, Transform, Camera };
