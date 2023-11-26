export const keys = {
  // arrows
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  // space bar
  Space: 32,
  // numbers
  Zero: 48,
  One: 49,
  Two: 50,
  Three: 51,
  Four: 52,
  Five: 53,
  Six: 54,
  Seven: 55,
  Eight: 56,
  Nine: 57,
  // Alphabets
  A: 65,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  Q: 81,
  R: 82,
  S: 83,
  X: 88,
  Y: 89,
  W: 87,
  LastKeyCode: 222,
};

export class Input {
  private mKeyPreviousState: boolean[] = [];
  private mIsKeyPressed: boolean[] = [];
  private mIsKeyClicked: boolean[] = [];
  keys = keys;

  cleanup() {}

  update() {
    for (let i = 0; i < keys.LastKeyCode; i++) {
      this.mIsKeyClicked[i] = !this.mKeyPreviousState[i] && this.mIsKeyPressed[i];
      this.mKeyPreviousState[i] = this.mIsKeyPressed[i];
    }
  }
  init() {
    for (let i = 0; i < keys.LastKeyCode; i++) {
      this.mIsKeyPressed[i] = false;
      this.mKeyPreviousState[i] = false;
      this.mIsKeyClicked[i] = false;
    }
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  isKeyPressed(keyCode: number): boolean {
    return this.mIsKeyPressed[keyCode];
  }

  isKeyClicked(keyCode: number): boolean {
    return this.mIsKeyClicked[keyCode];
  }

  private onKeyDown(event: KeyboardEvent) {
    this.mIsKeyPressed[event.keyCode] = true;
  }

  private onKeyUp(event: KeyboardEvent) {
    this.mIsKeyPressed[event.keyCode] = false;
  }
}

export default new Input();
