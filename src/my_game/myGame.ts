import * as engine from "../engine";

import "../style.css";
import { vec2 } from "../lib/gl-matrix";
import BlueLevel from "./BlueLevel";

export class MyGame extends engine.Scene {
  mCamera: engine.Camera | null = null;
  mSupport: engine.Renderable | null = null;
  mHero: engine.Renderable | null = null;
  mPortal: engine.TextureRenderable | null = null;
  mCollector: engine.TextureRenderable | null = null;

  mSceneFile = "/assets/scene.xml";
  mBackgroundAudio = "/assets/sounds/bg_clip.mp3";
  mCue = "/assets/sounds/my_game_cue.wav";
  kPortal = "/assets/minion_portal.png";
  kCollector = "/assets/minion_collector.png";

  constructor() {
    super();
  }

  init() {
    // Setup the camera
    this.mCamera = new engine.Camera(
      vec2.fromValues(20, 60), // position of the camera
      20, // width of camera
      [20, 40, 600, 300] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // Step B: Create the game objects
    this.mPortal = new engine.TextureRenderable(this.kPortal);
    this.mPortal.setColor([1, 0, 0, 0.2]); // tints red
    this.mPortal.getXform().setPosition(25, 60);
    this.mPortal.getXform().setSize(3, 3);

    this.mCollector = new engine.TextureRenderable(this.kCollector);
    this.mCollector.setColor([1, 1, 0, 0]); // No tinting
    this.mCollector.getXform().setPosition(15, 60);
    this.mCollector.getXform().setSize(3, 3);

    // Step C: Create the hero object in blue
    this.mHero = new engine.Renderable();
    this.mHero.setColor([0, 0, 1, 1]);
    this.mHero.getXform().setPosition(20, 60);
    this.mHero.getXform().setSize(2, 3);

    engine.audio.playBackground(this.mBackgroundAudio, 1.0);
  }

  load() {
    engine.audio.load(this.mBackgroundAudio);
    engine.audio.load(this.mCue);

    engine.texture.load(this.kPortal);
    engine.texture.load(this.kCollector);
  }

  unload() {
    engine.audio.unload(this.mBackgroundAudio);
    engine.audio.unload(this.mCue);

    engine.texture.unload(this.kPortal);
    engine.texture.unload(this.kCollector);
  }

  draw() {
    // Step A: clear the canvas
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    if (!this.mCamera) throw new Error("Camera not initialized");
    // Step  B: Activate the drawing Camera
    this.mCamera.setViewAndCameraMatrix();
    this.mPortal?.draw(this.mCamera);

    this.mCollector?.draw(this.mCamera);
    this.mHero?.draw(this.mCamera);
  }

  update() {
    if (!this.mHero) throw new Error("Hero not initialized");
    let xform = this.mHero.getXform();
    const deltaX = 0.05;

    // rotate the white square
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      // audio
      engine.audio.playCue(this.mCue, 0.5);
      engine.audio.incBackgroundVolume(0.05);

      xform.incXPosBy(deltaX);
      if (xform.getXpos() > 30) {
        // right bound of the window
        xform.setPosition(12, 60);
      }
    } else if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      engine.audio.playCue(this.mCue, 1.5);
      engine.audio.incBackgroundVolume(-0.05);

      xform.incXPosBy(-deltaX);
      if (xform.getXpos() < 11) {
        // left bound of the window
        this.next();
      }
    } else if (engine.input.isKeyPressed(engine.input.keys.Q)) {
      this.stop();
    }

    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      xform.incRotationByDegree(1);
    }
  }

  next() {
    super.next();
    const nextLevel = new BlueLevel();
    nextLevel.start();
  }
}

window.onload = function () {
  engine.init("GLCanvas");

  const game = new MyGame();
  game.start();
};
