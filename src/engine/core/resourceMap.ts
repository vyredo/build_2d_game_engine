class MapEntry {
  private mData = null;
  private mRefCount = 0;

  constructor(data: any) {
    this.mData = data;
    this.mRefCount = 1;
  }

  incRef = () => ++this.mRefCount;
  decRef = () => --this.mRefCount;
  getRef = () => this.mRefCount;
  canRemove = () => this.mRefCount <= 0;
  getData = () => this.mData;
  setData = (data: any) => (this.mData = data);
}

let mMap = new Map();
export let mOutstandingPromises: Promise<any>[] = [];

export const has = (path: string) => mMap.has(path);
export const get = (path: string) => {
  if (!has(path)) throw new Error(`Resource ${path} not found`);
  return mMap.get(path).getData();
};
export const set = (key: string, value: any) => {
  mMap.get(key).setData(value);
};
export const loadRequested = (path: string) => mMap.set(path, new MapEntry(null));
export const incRef = (path: string) => mMap.get(path).incRef();
export const unload = (path: string) => {
  const entry = mMap.get(path);
  entry.decRef();
  if (entry.canRemove()) mMap.delete(path);
  return entry.canRemove();
};
export const pushPromise = (p: Promise<any>) => mOutstandingPromises.push(p);
export const loadDecodeParse = (path: string, decodeResource: (data: any) => any, parseResource: (data: any) => any) => {
  let fetchPromise = null;
  if (!has(path)) {
    console.log(`Fetching ${path}`);
    loadRequested(path);
    fetchPromise = fetch(path)
      .then((res) => decodeResource(res))
      .then((data) => parseResource(data))
      .then((data) => set(path, data))
      .catch((err) => {
        throw err;
      });
    pushPromise(fetchPromise);
  } else {
    incRef(path); // increase reference count
  }
  return fetchPromise;
};
export const waitOnPromise = async () => {
  await Promise.all(mOutstandingPromises);
  mOutstandingPromises = [];
};
