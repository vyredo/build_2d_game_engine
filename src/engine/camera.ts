import { mat4, vec2, vec3 } from "../lib/gl-matrix";
import { GLSys } from "./core/gl";

const eViewPort = Object.freeze({
  eOrgX: 0,
  eOrgY: 1,
  eWidth: 2,
  eHeight: 3,
});
type Array4 = [number, number, number, number];
class Camera {
  mWCCenter: vec2.vec2;
  mWCWidth: number;
  mViewport: Array4;
  mNearPlane: number = 0;
  mFarPlane: number = 1000;
  mViewMatrix: mat4.mat4 = mat4.create();
  mProjMatrix: mat4.mat4 = mat4.create();
  mVPMatrix: mat4.mat4 = mat4.create();
  mBgColor: Array4 = [0.8, 0.8, 0.8, 1];
  mCameraMatrix: mat4.mat4 = mat4.create();

  constructor(wcCenter: vec2.vec2, wcWidth: number, viewportArray: Array4) {
    this.mWCCenter = wcCenter;
    this.mWCWidth = wcWidth;
    this.mViewport = viewportArray; // [x, y, width, height]

    // Camera transform operator
    this.mCameraMatrix = mat4.create();
  }

  setWCCenter = (x: number, y: number) => {
    this.mWCCenter[0] = x;
    this.mWCCenter[1] = y;
  };
  getWCCenter = () => this.mWCCenter;

  setWCWidth = (width: number) => (this.mWCWidth = width);
  getWCWidth = () => this.mWCWidth;

  getWCHeight() {
    const ratio = this.mViewport[eViewPort.eHeight] / this.mViewport[eViewPort.eWidth];
    return this.getWCWidth() * ratio;
  }

  setViewport = (viewportArray: Array4) => (this.mViewport = viewportArray);
  getViewport = () => this.mViewport;

  getBackgroundColor = () => this.mBgColor;
  setBackgroundColor = (newColor: Array4) => (this.mBgColor = newColor);

  getCameraMatrix = () => this.mCameraMatrix;
  setViewAndCameraMatrix() {
    const gl = GLSys.getGL();

    // configure the viewport
    gl.viewport(...this.mViewport);
    gl.scissor(...this.mViewport);
    gl.clearColor(...this.mBgColor);
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);

    // compute the camera matrix
    const center = this.getWCCenter();

    mat4.scale(this.mCameraMatrix, mat4.create(), vec3.fromValues(2.0 / this.getWCWidth(), 2.0 / this.getWCHeight(), 1.0));
    mat4.translate(this.mCameraMatrix, this.mCameraMatrix, vec3.fromValues(-center[0], -center[1], 0));
  }
}

export default Camera;
