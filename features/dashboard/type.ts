export const TEMPLATES = [
  "REACT",
  "NEXTJS",
  "EXPRESS",
  "VUE",
  "HONO",
  "ANGULAR",
] as const;

export type TemplateName = (typeof TEMPLATES)[number];

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  template: TemplateName;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  Starmark: { isMarked: boolean }[];
}

export interface ProjectFile {
  id: string;
  playgroundId: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirectory: boolean;
  createdAt: Date;
  updatedAt: Date;
}
