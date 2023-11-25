import * as engine from "./engine";

import { vec2 } from "./lib/gl-matrix";
import "./style.css";

class MyGame {
  mWhiteSq: engine.Renderable;
  mRedSq: engine.Renderable;
  mBlueSq: engine.Renderable;
  mTLSq: engine.Renderable;
  mTRSq: engine.Renderable;
  mBRSq: engine.Renderable;
  mBLSq: engine.Renderable;
  mCamera: engine.Camera;

  constructor(htmlCanvasID: string) {
    // Step A: Initialize the game engine, engine must be init before creating any renderable objects
    engine.init(htmlCanvasID);

    // Step B: Create the Renderable objects:
    this.mWhiteSq = new engine.Renderable();
    this.mBLSq = new engine.Renderable();
    this.mBRSq = new engine.Renderable();
    this.mTRSq = new engine.Renderable();
    this.mTLSq = new engine.Renderable();
    this.mBlueSq = new engine.Renderable();
    this.mRedSq = new engine.Renderable();

    this.mBlueSq.setColor([0.25, 0.25, 0.95, 1]);
    this.mRedSq.setColor([1, 0.25, 0.25, 1]);
    this.mWhiteSq.setColor([1, 1, 1, 1]);
    this.mTLSq.setColor([0.9, 0.1, 0.1, 1]);
    this.mTRSq.setColor([0.1, 0.9, 0.1, 1]);
    this.mBRSq.setColor([0.1, 0.1, 0.9, 1]);
    this.mBLSq.setColor([0.1, 0.1, 0.1, 1]);

    // Setup the camera
    this.mCamera = new engine.Camera(
      vec2.fromValues(20, 60), // center of the WC
      20, // width of WC
      [20, 40, 600, 300] // viewport (orgX, orgY, width, height)
    );

    // Step C: clear entire canvas !
    engine.clearCanvas([0.9, 0.9, 0.9, 1]); // Clear the canvas
    // activate camera
    this.mCamera.setViewAndCameraMatrix();

    // Draw blue square, center blue, slightly rotated square
    this.mBlueSq.getXform().setPosition(20, 60);
    this.mBlueSq.getXform().setRotationInRad(0.2);
    this.mBlueSq.getXform().setSize(5, 5);
    this.mBlueSq.draw(this.mCamera);

    // Draw the red square, top-left
    this.mRedSq.getXform().setPosition(20, 60);
    this.mRedSq.getXform().setSize(2, 2);
    this.mRedSq.draw(this.mCamera);

    // top left
    this.mTLSq.getXform().setPosition(10, 65);
    this.mTLSq.draw(this.mCamera);
    // top right
    this.mTRSq.getXform().setPosition(30, 65);
    this.mTRSq.draw(this.mCamera);
    // bottom right
    this.mBRSq.getXform().setPosition(30, 55);
    this.mBRSq.draw(this.mCamera);
    // bottom left
    this.mBLSq.getXform().setPosition(10, 55);
    this.mBLSq.draw(this.mCamera);
  }
}

window.onload = function () {
  new MyGame("GLCanvas");
};
