export type TransformPropKey = "x" | "y" | "z" | "rx" | "ry" | "rz";

export type TransformProp = {
  id: string;
  key: TransformPropKey;
  value: number;
};

export type CardProps = {
  id: string;
  transforms: TransformProp[];
  originX: number;
  originY: number;
};
