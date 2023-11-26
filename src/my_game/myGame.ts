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
  mRightMinion: engine.SpriteAnimateRenderable | null = null;
  mLeftMinion: engine.SpriteAnimateRenderable | null = null;

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

    // right minion
    this.mRightMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
    this.mRightMinion.setColor([1, 0, 1, 1]);
    this.mRightMinion.getXform().setPosition(26, 56.5);
    this.mRightMinion.getXform().setSize(4, 3.2);
    this.mRightMinion.setSpriteSequence(
      512,
      0, // first element pixel positions: top: 512 left: 0
      204,
      164, // widthxheight in pixels
      5, // number of elements in this sequence
      0
    ); // horizontal padding in between
    this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
    this.mRightMinion.setAnimationSpeed(50);

    // the left minion
    this.mLeftMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
    this.mLeftMinion.setColor([1, 1, 1, 0]);
    this.mLeftMinion.getXform().setPosition(15, 56.5);
    this.mLeftMinion.getXform().setSize(4, 3.2);
    this.mLeftMinion.setSpriteSequence(
      348,
      0, // first element pixel positions: top: 164 left: 0
      204,
      164, // widthxheight in pixels
      5, // number of elements in this sequence
      0
    );
    this.mLeftMinion.setAnimationType(engine.eAnimationType.eRight);
    this.mLeftMinion.setAnimationSpeed(50);

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

    // this.mMinion?.draw(this.mCamera);

    this.mPortal?.draw(this.mCamera);
    this.mCollector?.draw(this.mCamera);
    this.mHero?.draw(this.mCamera);
    this.mFontImage?.draw(this.mCamera);
    this.mRightMinion?.draw(this.mCamera);
    this.mLeftMinion?.draw(this.mCamera);
  }

  update() {
    if (!this.mCamera) throw new Error("Camera not initialized");
    if (!this.mHero) throw new Error("Hero not initialized");
    if (!this.mPortal) throw new Error("Portal not initialized");
    if (!this.mFontImage) throw new Error("Font image not initialized");
    if (!this.mRightMinion) throw new Error("Right minion not initialized");
    if (!this.mLeftMinion) throw new Error("Left minion not initialized");

    // let's only allow the movement of hero,
    let deltaX = 0.05;
    let xform = this.mHero.getXform();

    // Support hero movements
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      xform.incXPosBy(deltaX);
      if (xform.getXpos() > 30) {
        // this is the right-bound of the window
        xform.setPosition(12, 60);
      }
    }

    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      xform.incXPosBy(-deltaX);
      if (xform.getYpos() < 11) {
        // this is the left-bound of the window
        xform.setXPos(20);
      }
    }

    // continuously change texture tinting
    let c = this.mPortal.getColor();
    let ca = c[3] + deltaX;
    if (ca > 1) {
      ca = 0;
    }
    c[3] = ca;

    // New update code for changing the sub-texture regions being shown"
    let deltaT = 0.001;

    // The font image:
    // zoom into the texture by updating texture coordinate
    // For font: zoom to the upper left corner by changing bottom right
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

    // New code for controlling the sprite animation
    // controlling the sprite animation:
    // remember to update the minion's animation
    this.mRightMinion.updateAnimation();
    this.mLeftMinion.updateAnimation();

    // Animate left on the sprite sheet
    if (engine.input.isKeyClicked(engine.input.keys.One)) {
      this.mRightMinion.setAnimationType(engine.eAnimationType.eLeft);
      this.mLeftMinion.setAnimationType(engine.eAnimationType.eLeft);
    }

    // swing animation
    if (engine.input.isKeyClicked(engine.input.keys.Two)) {
      this.mRightMinion.setAnimationType(engine.eAnimationType.eSwing);
      this.mLeftMinion.setAnimationType(engine.eAnimationType.eSwing);
    }

    // Animate right on the sprite sheet
    if (engine.input.isKeyClicked(engine.input.keys.Three)) {
      this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
      this.mLeftMinion.setAnimationType(engine.eAnimationType.eRight);
    }

    // decrease the duration of showing each sprite element, thereby speeding up the animation
    if (engine.input.isKeyClicked(engine.input.keys.Four)) {
      this.mRightMinion.incAnimationSpeed(-2);
      this.mLeftMinion.incAnimationSpeed(-2);
    }

    // increase the duration of showing each sprite element, thereby slowing down the animation
    if (engine.input.isKeyClicked(engine.input.keys.Five)) {
      this.mRightMinion.incAnimationSpeed(2);
      this.mLeftMinion.incAnimationSpeed(2);
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
