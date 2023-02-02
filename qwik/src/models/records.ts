export interface PostRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  original: string;
  filtered: string;
  description: string;
  hashtags: string;
  poster: string;
}

export interface ExpandedPostRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  original: string;
  filtered: string;
  description: string;
  hashtags: string;
  expand: {
    poster: ExpandedUserRecord;
  };
}

export interface UserRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  package: string;
}

export interface ExpandedUserRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  expand: {
    package: PackageRecord;
  };
}

export interface PackageRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  package: "Free" | "Pro" | "Gold";
  postsToday: number;
}
