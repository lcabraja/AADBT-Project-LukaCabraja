import type { User } from "./user";

export type Post = {
  id: string;
  original: string;
  filtered: string;
  description: string;
  poster: User | string;
  hashtags: string;
};
