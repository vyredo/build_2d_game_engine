import { vec2, vec3, mat4 } from "../lib/gl-matrix";

export class Transform {
  mPosition: vec2.vec2;
  mScale: vec2.vec2;
  mRotationInRad: number;

  constructor() {
    this.mPosition = vec2.fromValues(0, 0);
    this.mScale = vec2.fromValues(1, 1);
    this.mRotationInRad = 0.0;
  }

  setPosition(x: number, y: number) {
    this.setXPos(x);
    this.setYPos(y);
  }
  setXPos = (x: number) => (this.mPosition[0] = x);
  getXpos = () => this.mPosition[0];
  incXPosBy = (delta: number) => (this.mPosition[0] += delta);

  getYpos = () => this.mPosition[1];
  setYPos = (y: number) => (this.mPosition[1] = y);
  incYPosBy = (delta: number) => (this.mPosition[1] += delta);

  getWidth = () => this.mScale[0];
  setWidth = (w: number) => (this.mScale[0] = w);
  incWidthBy = (delta: number) => (this.mScale[0] += delta);

  getHeight = () => this.mScale[1];
  setHeight = (h: number) => (this.mScale[1] = h);
  incHeightBy = (delta: number) => (this.mScale[1] += delta);

  getSize = () => this.mScale;
  setSize(w: number, h: number) {
    this.setWidth(w);
    this.setHeight(h);
  }
  incSizeBy(delta: number) {
    this.incWidthBy(delta);
    this.incHeightBy(delta);
  }

  setRotationInRad(rotationInRadians: number) {
    this.mRotationInRad = rotationInRadians;
    while (this.mRotationInRad > 2 * Math.PI) {
      this.mRotationInRad -= 2 * Math.PI;
    }
  }

  setRotationInDegree(rotationInDegree: number) {
    this.setRotationInRad((rotationInDegree * Math.PI) / 180.0);
  }
  incRotationByDegree(deltaDegree: number) {
    this.incRotationByRad((deltaDegree * Math.PI) / 180.0);
  }
  incRotationByRad(deltaRad: number) {
    this.setRotationInRad(this.mRotationInRad + deltaRad);
  }
  getRotationInRad = () => this.mRotationInRad;
  getRotationInDegree = () => (this.mRotationInRad * 180.0) / Math.PI;

  getTRSMatrix() {
    let matrix = mat4.create(); // blank identity matrix
    // The matrices that WebGL uses are transposed, thus the typical matrix
    // operations must be in reverse.
    mat4.translate(matrix, matrix, vec3.fromValues(this.getXpos(), this.getYpos(), 0.0));

    mat4.rotateZ(matrix, matrix, this.getRotationInRad());
    mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));
    return matrix;
  }
}
