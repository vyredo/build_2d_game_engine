import * as engine from "../engine";

import "../style.css";
import { vec2 } from "../lib/gl-matrix";
import BlueLevel from "./BlueLevel";

export class MyGame extends engine.Scene {
  mCamera: engine.Camera | null = null;
  mSupport: engine.Renderable | null = null;
  mHero: engine.SpriteRenderable | null = null;
  mPortal: engine.SpriteRenderable | null = null;
  mCollector: engine.SpriteRenderable | null = null;
  mFontImage: engine.SpriteRenderable | null = null;
  mMinion: engine.SpriteRenderable | null = null;

  mSceneFile = "/assets/scene.xml";
  mBackgroundAudio = "/assets/sounds/bg_clip.mp3";
  mCue = "/assets/sounds/my_game_cue.wav";
  kMinionSprite = "/assets/minion_sprite.png";
  kFontImage = "/assets/consolas-72.png";
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
    this.mPortal = new engine.SpriteRenderable(this.kMinionSprite);
    this.mPortal.setColor([1, 0, 0, 0.2]); // tints red
    this.mPortal.getXform().setPosition(25, 60);
    this.mPortal.getXform().setSize(3, 3);
    this.mPortal.setElementPixelPositions(130, 310, 0, 180);

    this.mCollector = new engine.SpriteRenderable(this.kMinionSprite);
    this.mCollector.setColor([1, 1, 0, 0]); // No tinting
    this.mCollector.getXform().setPosition(15, 60);
    this.mCollector.getXform().setSize(3, 3);
    this.mCollector.setElementUVCoordinate(0.308, 0.483, 0, 0.352);

    // Step C: Create the font and minion images using sprite
    this.mFontImage = new engine.SpriteRenderable(this.kFontImage);
    this.mFontImage.setColor([1, 1, 1, 0]);
    this.mFontImage.getXform().setPosition(13, 62);
    this.mFontImage.getXform().setSize(4, 4);

    this.mMinion = new engine.SpriteRenderable(this.kMinionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(26, 56);
    this.mMinion.getXform().setSize(5, 2.5);

    // Step C: Create the hero object in blue
    this.mHero = new engine.SpriteRenderable(this.kMinionSprite);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(20, 60);
    this.mHero.getXform().setSize(2, 3);
    this.mHero.setElementPixelPositions(0, 120, 0, 180);

    engine.audio.playBackground(this.mBackgroundAudio, 1.0);
  }

  load() {
    engine.audio.load(this.mBackgroundAudio);
    engine.audio.load(this.mCue);

    engine.texture.load(this.kPortal);
    engine.texture.load(this.kCollector);

    engine.texture.load(this.kFontImage);
    engine.texture.load(this.kMinionSprite);
  }

  unload() {
    engine.audio.unload(this.mBackgroundAudio);
    engine.audio.unload(this.mCue);

    engine.texture.unload(this.kPortal);
    engine.texture.unload(this.kCollector);

    engine.texture.unload(this.kFontImage);
    engine.texture.unload(this.kMinionSprite);
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
    this.mFontImage?.draw(this.mCamera);
    this.mMinion?.draw(this.mCamera);
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

    // New update code for changing the sub-texture regions being shown"
    let deltaT = 0.001;

    // The font image:
    // zoom into the texture by updating texture coordinate
    // For font: zoom to the upper left corner by changing bottom right
    if (!this.mFontImage) throw new Error("Font image not initialized");
    let texCoord = this.mFontImage.getElementUVCoordinateArray();
    // The 8 elements:
    //      mTexRight,  mTexTop,          // x,y of top-right
    //      mTexLeft,   mTexTop,
    //      mTexRight,  mTexBottom,
    //      mTexLeft,   mTexBottom
    let b = texCoord[engine.eTexCoordArrayIndex.eBottom] + deltaT;
    let r = texCoord[engine.eTexCoordArrayIndex.eRight] - deltaT;
    if (b > 1.0) {
      b = 0;
    }
    if (r < 0) {
      r = 1.0;
    }
    this.mFontImage.setElementUVCoordinate(texCoord[engine.eTexCoordArrayIndex.eLeft], r, b, texCoord[engine.eTexCoordArrayIndex.eTop]);
    //

    // The minion image:
    // For minion: zoom to the bottom right corner by changing top left
    if (!this.mMinion) throw new Error("Minion not initialized");
    texCoord = this.mMinion.getElementUVCoordinateArray();
    // The 8 elements:
    //      mTexRight,  mTexTop,          // x,y of top-right
    //      mTexLeft,   mTexTop,
    //      mTexRight,  mTexBottom,
    //      mTexLeft,   mTexBottom
    let t = texCoord[engine.eTexCoordArrayIndex.eTop] - deltaT;
    let l = texCoord[engine.eTexCoordArrayIndex.eLeft] + deltaT;

    if (l > 0.5) {
      l = 0;
    }
    if (t < 0.5) {
      t = 1.0;
    }

    this.mMinion.setElementUVCoordinate(l, texCoord[engine.eTexCoordArrayIndex.eRight], texCoord[engine.eTexCoordArrayIndex.eBottom], t);
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
