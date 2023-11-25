import { has, get, unload, loadDecodeParse } from "../core/resourceMap";

class XML {
  unload = unload;
  has = has;
  get = get;
  mParser = new DOMParser();

  decodeXML = (data: { text(): any }) => data.text();
  parseXML = (text: string) => this.mParser.parseFromString(text, "text/xml");
  load(path: string) {
    return loadDecodeParse(path, this.decodeXML, this.parseXML);
  }
}
export default new XML();
