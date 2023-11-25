import * as engine from "../engine";
import { vec2 } from "../lib/gl-matrix";
type Array4 = [number, number, number, number];

export class SceneFileParser {
  private mXml: XMLDocument;
  constructor(xml: XMLDocument) {
    this.mXml = xml;
  }

  getElm(xmlContent: XMLDocument, tagElem: string) {
    const theElm = xmlContent.getElementsByTagName(tagElem);
    console.log("theElm:", theElm);
    if (theElm.length === 0) {
      console.error("Warning: Level element: " + tagElem + " is not found!");
    }
    return theElm;
  }

  parseCamera() {
    const camElm = this.getElm(this.mXml, "Camera");
    console.log("camElem:", camElm);
    if (!camElm) throw new Error("Camera element not found");
    const cx = Number(camElm[0].getAttribute("CenterX"));
    const cy = Number(camElm[0].getAttribute("CenterY"));
    const w = Number(camElm[0].getAttribute("Width"));
    // make sure viewport and color are number
    const viewport =
      (camElm[0]
        .getAttribute("Viewport")
        ?.split(" ")
        .map((i) => Number(i)) as Array4) ?? [];
    const bgColor =
      (camElm[0]
        .getAttribute("BgColor")
        ?.split(" ")
        .map((i) => Number(i)) as Array4) ?? [];

    const cam = new engine.Camera(vec2.fromValues(cx, cy), w, viewport);
    cam.setBackgroundColor(bgColor);
    return cam;
  }

  parseSquares(sqSet: Array<engine.Renderable>) {
    const sqElm = this.getElm(this.mXml, "Square");
    if (!sqElm) throw new Error("Square element not found");
    for (let i = 0; i < sqElm.length; i++) {
      const x = Number(sqElm.item(i)?.attributes.getNamedItem("PosX")?.value);
      const y = Number(sqElm.item(i)?.attributes.getNamedItem("PosY")?.value);
      const w = Number(sqElm.item(i)?.attributes.getNamedItem("Width")?.value);
      const h = Number(sqElm.item(i)?.attributes.getNamedItem("Height")?.value);
      const r = Number(sqElm.item(i)?.attributes.getNamedItem("Rotation")?.value);
      const c =
        (sqElm[i]
          .getAttribute("Color")
          ?.split(" ")
          .map((i) => Number(i)) as Array4) ?? [];
      const sq = new engine.Renderable();
      sq.setColor(c);
      sq.getXform().setPosition(x, y);
      sq.getXform().setRotationInDegree(r);
      sq.getXform().setSize(w, h);
      sqSet.push(sq);
    }
  }
}
