export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string;
  createdAt: number;
  updatedAt: number;
};

export type Folder = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type Notebook = {
  id: string;
  title: string;
  folderId: string | null;
  cover: string;
  template: "blank" | "lined" | "grid" | "dotted";
  favorite: boolean;
  pageCount: number;
  createdAt: number;
  updatedAt: number;
};

export type Point = {
  x: number;
  y: number;
  pressure?: number;
};

export type Stroke = {
  id: string;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  tool: "pen" | "highlighter";
};

export type Page = {
  id: string;
  pageNumber: number;
  template: Notebook["template"];
  strokes: Stroke[];
  createdAt: number;
  updatedAt: number;
};