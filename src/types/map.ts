
export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  name: string;
  points: Point[];
  color: string;
}
