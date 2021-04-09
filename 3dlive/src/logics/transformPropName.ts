import { TransformPropKey } from "@/types/CardProps";

export const transformPropName: { [k in TransformPropKey]: string } = {
  x: "移動(X)",
  y: "移動(Y)",
  z: "移動(Z)",
  rx: "回転(X)",
  ry: "回転(Y)",
  rz: "回転(Z)"
};
