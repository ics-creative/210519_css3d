import { TransformPropKey } from "@/types/CardProps";

export const transformPropUnit: { [k in TransformPropKey]: string } = {
  x: "px",
  y: "px",
  z: "px",
  rx: "deg",
  ry: "deg",
  rz: "deg"
};
