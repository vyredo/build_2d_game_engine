import * as engine from "../engine";
import { SceneFileParser } from "./fileParser";
import { MyGame } from "./myGame";

class BlueLevel extends engine.Scene {
  mSceneFile = "/assets/blue_level.xml";
  mSQSet: engine.Renderable[] = [];
  mCamera: engine.Camera | null = null;
  mBackgroundAudio = "/assets/sounds/bg_clip.mp3";
  mCue = "/assets/sounds/blue_level_cue.wav";

  constructor() {
    super();
    engine.xml.load(this.mSceneFile);
    this.init();
  }
  async init() {
    await engine.map.waitOnPromise();
    let sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile));

    // Step A: Read in the camera
    this.mCamera = sceneParser.parseCamera();

    // Step B: Read all the squares
    sceneParser.parseSquares(this.mSQSet);
    engine.audio.playBackground(this.mBackgroundAudio, 0.5);
  }
  draw() {
    if (!this.mCamera) throw new Error("Camera not initialized");
    // Step A: set up the camera
    this.mCamera.setViewAndCameraMatrix();
    // Step B: draw everything with the camera
    for (let i = 0; i < this.mSQSet.length; i++) {
      this.mSQSet[i].draw(this.mCamera);
    }
  }
  update() {
    // For this very simple game, let's move the first square
    let xform = this.mSQSet[1].getXform();
    let deltaX = 0.05;

    // Move right and swap over
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      engine.audio.playCue(this.mCue, 0.5);

      xform.incXPosBy(deltaX);
      if (xform.getXpos() > 30) {
        // this is the right-bound of the window
        xform.setPosition(12, 60);
      }
    }

    // test for white square movement
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      engine.audio.playCue(this.mCue, 1.0);

      xform.incXPosBy(-deltaX);
      if (xform.getXpos() < 11) {
        // this is the left-boundary
        this.next(); // go back to my game
      }
    }

    if (engine.input.isKeyPressed(engine.input.keys.Q)) this.stop(); // Quit the game
  }
  load() {
    engine.xml.load(this.mSceneFile);
    engine.audio.load(this.mBackgroundAudio);
    engine.audio.load(this.mCue);
  }

  unload() {
    // stop the background audio
    engine.audio.stopBackground();
    // unload the scene file and loaded resources
    engine.xml.unload(this.mSceneFile);
    engine.audio.unload(this.mBackgroundAudio);
    engine.audio.unload(this.mCue);
  }
  next() {
    super.next();
    const nextLevel = new MyGame();
    nextLevel.start();
  }
}

export default BlueLevel;
