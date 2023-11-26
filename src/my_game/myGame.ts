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

  mTextSysFont: engine.FontRenderable | null = null;
  mTextCon16: engine.FontRenderable | null = null;
  mTextCon24: engine.FontRenderable | null = null;
  mTextCon32: engine.FontRenderable | null = null;
  mTextCon72: engine.FontRenderable | null = null;
  mTextSeg96: engine.FontRenderable | null = null;
  mTextToWork: engine.FontRenderable | null = null;

  mSceneFile = "/assets/scene.xml";
  mBackgroundAudio = "/assets/sounds/bg_clip.mp3";
  mCue = "/assets/sounds/my_game_cue.wav";
  kMinionSprite = "/assets/minion_sprite.png";
  kFontImage = "/assets/consolas-72.png";
  kPortal = "/assets/minion_portal.png";
  kCollector = "/assets/minion_collector.png";
  kFontCon16 = "assets/fonts/consolas-16"; // notice font names do not need extensions!
  kFontCon24 = "assets/fonts/consolas-24";
  kFontCon32 = "assets/fonts/consolas-32"; // this is also the default system font
  kFontCon72 = "assets/fonts/consolas-72";
  kFontSeg96 = "assets/fonts/segment7-96";

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
    this.mRightMinion.setColor([1, 0, 1, 0]);
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

    // Create the fonts
    this.mTextSysFont = new engine.FontRenderable("System Font: in Red");
    this._initText(this.mTextSysFont, 50, 60, [1, 0, 0, 1], 3);

    this.mTextCon16 = new engine.FontRenderable("Consolas 16: in black");
    this.mTextCon16.setFontName(this.kFontCon16);
    this._initText(this.mTextCon16, 50, 55, [0, 0, 0, 1], 2);

    this.mTextCon24 = new engine.FontRenderable("Consolas 24: in black");
    this.mTextCon24.setFontName(this.kFontCon24);
    this._initText(this.mTextCon24, 50, 50, [0, 0, 0, 1], 3);

    this.mTextCon32 = new engine.FontRenderable("Consolas 32: in white");
    this.mTextCon32.setFontName(this.kFontCon32);
    this._initText(this.mTextCon32, 40, 40, [1, 1, 1, 1], 4);

    this.mTextCon72 = new engine.FontRenderable("Consolas 72: in blue");
    this.mTextCon72.setFontName(this.kFontCon72);
    this._initText(this.mTextCon72, 30, 30, [0, 0, 1, 1], 6);

    this.mTextSeg96 = new engine.FontRenderable("Segment7-92");
    this.mTextSeg96.setFontName(this.kFontSeg96);
    this._initText(this.mTextSeg96, 30, 15, [1, 1, 0, 1], 7);

    this.mTextToWork = this.mTextCon16;

    engine.audio.playBackground(this.mBackgroundAudio, 1.0);
  }

  load() {
    engine.audio.load(this.mBackgroundAudio);
    engine.audio.load(this.mCue);

    engine.texture.load(this.kPortal);
    engine.texture.load(this.kCollector);

    engine.texture.load(this.kFontImage);
    engine.texture.load(this.kMinionSprite);

    engine.font.load(this.kFontCon16);
    engine.font.load(this.kFontCon24);
    engine.font.load(this.kFontCon32);
    engine.font.load(this.kFontCon72);
    engine.font.load(this.kFontSeg96);
  }

  unload() {
    engine.audio.unload(this.mBackgroundAudio);
    engine.audio.unload(this.mCue);

    engine.texture.unload(this.kPortal);
    engine.texture.unload(this.kCollector);

    engine.texture.unload(this.kFontImage);
    engine.texture.unload(this.kMinionSprite);

    engine.font.unload(this.kFontCon16);
    engine.font.unload(this.kFontCon24);
    engine.font.unload(this.kFontCon32);
    engine.font.unload(this.kFontCon72);
    engine.font.unload(this.kFontSeg96);
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

    // font
    // drawing the text output
    this.mTextSysFont?.draw(this.mCamera);
    this.mTextCon16?.draw(this.mCamera);
    this.mTextCon24?.draw(this.mCamera);
    this.mTextCon32?.draw(this.mCamera);
    this.mTextCon72?.draw(this.mCamera);
    this.mTextSeg96?.draw(this.mCamera);
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

    /** =================== FONT UPDATE ============================== */
    // choose which text to work on
    if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
      this.mTextToWork = this.mTextCon16;
    }
    if (engine.input.isKeyClicked(engine.input.keys.One)) {
      this.mTextToWork = this.mTextCon24;
    }
    if (engine.input.isKeyClicked(engine.input.keys.Three)) {
      this.mTextToWork = this.mTextCon32;
    }
    if (engine.input.isKeyClicked(engine.input.keys.Four)) {
      this.mTextToWork = this.mTextCon72;
    }

    if (!this.mTextToWork) return;
    if (!this.mTextSysFont) return;
    let deltaF = 0.005;
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      if (engine.input.isKeyPressed(engine.input.keys.X)) {
        this.mTextToWork.getXform().incWidthBy(deltaF);
      }
      if (engine.input.isKeyPressed(engine.input.keys.Y)) {
        this.mTextToWork.getXform().incHeightBy(deltaF);
      }
      this.mTextSysFont.setText(this.mTextToWork.getXform().getWidth().toFixed(2) + "x" + this.mTextToWork.getXform().getHeight().toFixed(2));
    }

    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      if (engine.input.isKeyPressed(engine.input.keys.X)) {
        this.mTextToWork.getXform().incWidthBy(-deltaF);
      }
      if (engine.input.isKeyPressed(engine.input.keys.Y)) {
        this.mTextToWork.getXform().incHeightBy(-deltaF);
      }
      this.mTextSysFont.setText(this.mTextToWork.getXform().getWidth().toFixed(2) + "x" + this.mTextToWork.getXform().getHeight().toFixed(2));
    }
  }

  next() {
    super.next();
    const nextLevel = new BlueLevel();
    nextLevel.start();
  }

  _initText(font: engine.FontRenderable, posX: number, posY: number, color: [number, number, number, number], textH: number) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
  }
}

window.onload = function () {
  engine.init("GLCanvas");

  const game = new MyGame();
  game.start();
};
