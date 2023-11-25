import { Scene, input } from "..";
import { waitOnPromise } from "./resourceMap";

const kUPS = 60; // Updates per second
const kMPF = 1000 / kUPS; // Milliseconds per frame.

class GameLoop {
  private mPrevTime: number = 0;
  private mLagTime: number = 0;
  private mLoopRunning: boolean = false;
  private mCurrentScene: Scene | null = null;
  private mFrameID = -1;
  cleanup() {
    if (this.mLoopRunning) {
      this.stop();
      this.mCurrentScene?.unload();
      this.mCurrentScene = null;
    }
  }
  loopOnce() {
    if (!this.mLoopRunning) return;
    if (!this.mCurrentScene) throw new Error("Scene not initialized");
    this.mFrameID = requestAnimationFrame(() => this.loopOnce());
    this.mCurrentScene.draw();
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.mPrevTime;
    this.mPrevTime = currentTime;
    this.mLagTime += elapsedTime;

    // Update the game the appropriate number of times.
    while (this.mLagTime >= kMPF && this.mLoopRunning) {
      input.update();
      this.mCurrentScene.update();
      this.mLagTime -= kMPF;
    }
  }

  async start(scene: Scene) {
    if (this.mLoopRunning) throw new Error("Loop already running");

    this.mCurrentScene = scene;
    this.mCurrentScene.load();

    // wait for any async request before game-load
    await waitOnPromise();

    this.mCurrentScene.init();

    this.mPrevTime = performance.now();
    this.mLagTime = 0.0;
    this.mLoopRunning = true;
    this.mFrameID = requestAnimationFrame(() => this.loopOnce());
  }

  stop() {
    cancelAnimationFrame(this.mFrameID);
    this.mLoopRunning = false;
  }
}

export default new GameLoop();
