export interface Photo {
  id: number;
  width: number;
  height: number;
  type: string;
}

export interface PhotoOrder {
  code: number;
  value: Photo;
}

export interface Order {
  id: number;
  index: number;
}
