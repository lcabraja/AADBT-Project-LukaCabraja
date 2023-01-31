export type Package = {
  id: string;
  package: "free" | "pro" | "gold";
  postsToday?: number
};
