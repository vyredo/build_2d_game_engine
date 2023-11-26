import { has, get, unload, loadDecodeParse } from "../core/resourceMap";

const DEFAULT_INIT_GAIN = 0.1;

class Audio {
  unload = unload;
  has = has;
  get = get;
  mAudioContext: AudioContext | null = null;
  mCueGain: GainNode | null = null;
  mMasterGain: GainNode | null = null;
  mBGMGain: GainNode | null = null;
  mBGAudio: AudioBufferSourceNode | null = null;

  decodeResource = (data: { arrayBuffer(): any }) => data.arrayBuffer();
  parseResource = (data: any) => {
    try {
      return this.mAudioContext?.decodeAudioData(data);
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
  };
  load(path: string) {
    return loadDecodeParse(path, this.decodeResource, this.parseResource);
  }
  init() {
    try {
      // connect master gain

      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("AudioContext not supported");
      const audioContext = (this.mAudioContext = new AudioContextClass());

      // connect Master volume control
      const masterGain = audioContext.createGain();
      this.mMasterGain = masterGain;
      masterGain.connect(audioContext.destination);
      masterGain.gain.value = DEFAULT_INIT_GAIN; // set default Master volume

      // connect background volume control
      const bgmGain = audioContext.createGain();
      this.mBGMGain = bgmGain;
      bgmGain.connect(masterGain);
      bgmGain.gain.value = 1.0;

      // connect Cue volume control
      const cueGain = audioContext.createGain();
      this.mCueGain = cueGain;
      cueGain.connect(masterGain);
      cueGain.gain.value = 1.0;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  playCue(path: string, volume: number) {
    if (!this.mAudioContext) throw new Error("AudioContext not initialized");
    if (!this.mCueGain) throw new Error("CueGain not initialized");
    const source = this.mAudioContext?.createBufferSource();
    if (!source) throw new Error("BufferSource not initialized");
    source.buffer = this.get(path);
    try {
      source.start(0);
    } catch (e: any) {
      console.error(e);
      //   throw new Error(e);
    }

    // volume support for cue
    source.connect(this.mCueGain);
    this.mCueGain.gain.value = volume;
  }

  playBackground(path: string, volume: number) {
    if (!has(path)) throw new Error(`Audio ${path} not loaded`);
    if (!this.mAudioContext) throw new Error("AudioContext not initialized");
    if (!this.mBGMGain) throw new Error("BGMGain not initialized");

    this.stopBackground();
    this.mBGAudio = this.mAudioContext.createBufferSource();

    if (!this.mBGAudio) throw new Error("BufferSource not initialized");
    this.mBGAudio.buffer = this.get(path);
    this.mBGAudio.loop = true;
    this.mBGAudio.connect(this.mBGMGain);
    try {
      this.mBGAudio.start(0);
    } catch (e: any) {
      console.error(e);
      //   throw new Error(e);
    }

    this.setBackgroundVolume(volume);
  }
  stopBackground() {
    if (this.mBGAudio) {
      this.mBGAudio.stop(0);
      this.mBGAudio = null;
    }
  }
  isBackgroundPlaying = () => this.mBGAudio != null;
  setBackgroundVolume(volume: number) {
    if (this.mBGMGain == null) throw new Error("BGMGain not initialized");
    this.mBGMGain.gain.value = volume;
  }
  incBackgroundVolume(inc: number) {
    if (this.mBGMGain == null) throw new Error("BGMGain not initialized");
    this.mBGMGain.gain.value += inc;
    // need this since volume increases when negative
    if (this.mBGMGain.gain.value < 0) this.setBackgroundVolume(0);
  }

  setMasterVolume(volume: number) {
    if (this.mMasterGain == null) throw new Error("MasterGain not initialized");
    this.mMasterGain.gain.value = volume;
  }

  incMasterVolume(inc: number) {
    if (this.mMasterGain == null) throw new Error("MasterGain not initialized");
    this.mMasterGain.gain.value += inc;
    // need this since volume increases when negative
    if (this.mMasterGain.gain.value < 0) this.setMasterVolume(0);
  }

  cleanup() {
    this.stopBackground();
    this.mAudioContext?.close();
    this.mAudioContext = null;
  }
}
export default new Audio();
