import type { Package } from "./package";

export type User = {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  package: Package | string;
};
