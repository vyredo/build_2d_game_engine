export class GLSys {
  static mGL: WebGL2RenderingContext | null = null;
  static mCanvas: HTMLCanvasElement | null = null;

  static getGL() {
    if (GLSys.mGL == null) throw new Error("GLSys.mGL is null");
    return GLSys.mGL;
  }

  static init(htmlCanvasID: string) {
    const canvas = (GLSys.mCanvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement);
    if (canvas == null) throw new Error("Engine init [" + htmlCanvasID + "] HTML element id not found");

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    GLSys.mGL = (canvas.getContext("webgl2") as WebGL2RenderingContext) || canvas.getContext("experimental-webgl2");

    if (GLSys.mGL == null) {
      document.write("<br><b>WebGL 2 is not supported!</b>");
      return;
    }
  }
}
