import { TransformPropKey } from "@/types/CardProps";

export const transformPropFuncName: { [k in TransformPropKey]: string } = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  rx: "rotateX",
  ry: "rotateY",
  rz: "rotateZ"
};
