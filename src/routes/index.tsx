import { component$, Resource, useResource$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
// import styles from "./index.css?inline";
import PocketBase from "pocketbase";

import type { Post as PostModel } from "~/models/post";
import { Post } from "../components/post/post";

interface ExpandedPostRecord {
  id: string;
  original: string;
  filtered: string;
  description: string;
  hashtags: string;
  expand: {
    poster: {
      id: string;
      username: string;
      name: string;
      email: string;
      avatar: string;
      expand: {
        package: {
          id: string;
          package: "free" | "pro" | "gold";
          postsToday: number;
        };
      };
    };
  };
}

export default component$(() => {
  const users = useResource$<number>(async () => {
    const pb = new PocketBase("https://aadbt.lcabraja.dev");
    return (await pb.collection("users").getList(1, 20)).totalItems;
  });

  const feed = useResource$<PostModel[]>(async () => {
    const pb = new PocketBase("https://aadbt.lcabraja.dev");
    const posts = (
      await pb.collection("posts").getList(1, 20, {
        expand: "poster,poster.package",
        sort: "-updated",
      })
    ).items;
    return posts.map((post): PostModel => {
      const epr = post as unknown as ExpandedPostRecord;
      return {
        id: epr.id,
        original: pb.getFileUrl(post, epr.original),
        filtered: pb.getFileUrl(post, epr.filtered),
        description: epr.description,
        hashtags: epr.hashtags,
        poster: {
          id: epr.expand.poster.id,
          username: epr.expand.poster.username,
          name: epr.expand.poster.name,
          email: epr.expand.poster.email,
          avatar: epr.expand.poster.avatar,
          package: {
            id: epr.expand.poster.expand.package.id,
            package: epr.expand.poster.expand.package.package,
            postsToday: 2,
          },
        },
      };
    });
  });

  return (
    <div>
      <h1>
        <Resource
          value={users}
          onPending={() => <div></div>}
          onResolved={(userCount: number) => (
            <>
              {userCount} registered users <span class="lightning">🎞️</span>
            </>
          )}
        />
      </h1>
      <Resource
        value={feed}
        onPending={() => <>Error loading feed...</>}
        onResolved={(posts) => {
          return (
            <>
              {posts.map((post: PostModel) => (
                <Post post={post} />
              ))}
            </>
          );
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Isstagram",
  meta: [
    {
      name: "description",
      content: "Isstagram is a place for extroverts to share photos",
    },
  ],
};
