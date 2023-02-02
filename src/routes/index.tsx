import {
  component$,
  Resource,
  useResource$,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { pbFactory } from "~/models/pocketbase";
import { type Post as PostModel } from "~/models/post";
import { Post } from "~/components/post/post";
import { type ExpandedPostRecord } from "~/models/records";
import styles from "./index.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore({ search: "" });

  const users = useResource$<number>(async () => {
    const pb = pbFactory();
    return (await pb.collection("users").getList(1, 20)).totalItems;
  });

  const feed = useResource$<PostModel[]>(async () => {
    const pb = pbFactory();
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
          // @ts-ignore
          avatar: pb.getFileUrl(post.expand.poster, epr.expand.poster.avatar),
          package: {
            id: epr.expand.poster.expand.package.id,
            package: epr.expand.poster.expand.package.package,
            postsToday: posts.length,
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
      <input
        onInput$={(event) => {
          const input = event.target as HTMLInputElement;
          store.search = input.value;
        }}
        onChange$={() =>
          (window.location = "/search?q=" + encodeURI(store.search))
        }
      />
      <div class="feed">
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
