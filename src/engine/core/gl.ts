export class GLSys {
  static mGL: WebGL2RenderingContext | null = null;
  static mCanvas: HTMLCanvasElement | null = null;

  static cleanup() {
    if (GLSys.mGL == null) throw new Error("GLSys.mGL is null");
    if (GLSys.mCanvas == null) throw new Error("GLSys.mCanvas is null");
    GLSys.mGL = null;
    GLSys.mCanvas.style.position = "fixed";
    GLSys.mCanvas.style.backgroundColor = "rgba(200, 200, 200, 0.5)";
    GLSys.mCanvas = null;
    document.body.innerHTML += "<br><br><h1>End of Game</h1><h1>GL System Shut Down</h1>";
  }
  static getGL() {
    if (GLSys.mGL == null) throw new Error("GLSys.mGL is null");
    return GLSys.mGL;
  }

  static init(htmlCanvasID: string) {
    const canvas = (GLSys.mCanvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement);
    if (canvas == null) throw new Error("Engine init [" + htmlCanvasID + "] HTML element id not found");

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    GLSys.mGL =
      (canvas.getContext("webgl2", { alpha: false }) as WebGL2RenderingContext) || canvas.getContext("experimental-webgl2", { alpha: false });

    if (GLSys.mGL == null) {
      document.write("<br><b>WebGL 2 is not supported!</b>");
      return;
    }

    // Allows transparency with textures.
    GLSys.mGL.blendFunc(GLSys.mGL.SRC_ALPHA, GLSys.mGL.ONE_MINUS_SRC_ALPHA);
    GLSys.mGL.enable(GLSys.mGL.BLEND);

    // Set images to flip y axis to match the texture coordinate space.
    GLSys.mGL.pixelStorei(GLSys.mGL.UNPACK_FLIP_Y_WEBGL, true);
  }
}
