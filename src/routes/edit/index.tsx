import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { pbFactory } from "~/models/pocketbase";
import { ExpandedPostRecord } from "~/models/records";
import { Post } from "~/models/post";

export default component$(() => {
  const loc = useLocation();
  const store = useStore<{
    post?: Post;
    error: boolean;
    description: string;
    hashtags: string;
  }>({
    post: undefined,
    error: false,
    description: "",
    hashtags: "",
  });

  useTask$(async () => {
    const pb = pbFactory();
    try {
      if (loc.query.postId == undefined) return;
      const post = await pb.collection("posts").getOne(loc.query.postId, {
        expand: "poster,poster.package",
      });

      const epr = post as unknown as ExpandedPostRecord;

      store.post = {
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
          },
        },
      };
      store.description = epr.description;
      store.hashtags = epr.hashtags;
    } catch {
      store.error = true;
    }
  });

  return (
    <>
      {store.error && <h1>Cannot fetch post with id: [{loc.query.postId}]</h1>}
      {store.post && (
        <>
          <img src={store.post.filtered} />
          <input value={store.description} placeholder="Description" />
          <input value={store.hashtags} placeholder="#hashtags" />
          <button
            onClick$={async () => {
              const pb = await pbFactory();
              await pb
                .collection("posts")
                .update(store.post!.id, {
                  description: store.description,
                  hashtags: store.hashtags,
                });
            }}
          >
            Update
          </button>
          <button
            onClick$={async () => {
              const pb = await pbFactory();
              await pb.collection("posts").delete(store.post!.id);
              await pb.collection("logs").create({
                user: pb.authStore.model!.id,
                action: "create",
                collection: "posts",
              });
            }}
          >
            Delete
          </button>
        </>
      )}
    </>
  );
});
