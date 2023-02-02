import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { pbFactory } from "~/models/pocketbase";
import { ExpandedPostRecord } from "~/models/records";
import { Post } from "~/models/post";

export default component$(() => {
  const loc = useLocation();
  const store = useStore<{ post?: Post }>({ post: undefined });

  //   useTask$(async () => {
  //     const pb = newPb();
  //     const post = await pb.collection("posts").getOne(loc.params.postId, {
  //       expand: "poster,poster.package",
  //     });

  //     const epr = post as unknown as ExpandedPostRecord;

  //     store.post = {
  //       id: epr.id,
  //       original: pb.getFileUrl(post, epr.original),
  //       filtered: pb.getFileUrl(post, epr.filtered),
  //       description: epr.description,
  //       hashtags: epr.hashtags,
  //       poster: {
  //         id: epr.expand.poster.id,
  //         username: epr.expand.poster.username,
  //         name: epr.expand.poster.name,
  //         email: epr.expand.poster.email,
  //         // @ts-ignore
  //         avatar: pb.getFileUrl(post.expand.poster, epr.expand.poster.avatar),
  //         package: {
  //           id: epr.expand.poster.expand.package.id,
  //           package: epr.expand.poster.expand.package.package,
  //         },
  //       },
  //     };
  //   });

  return <>{store.post && <img src={store.post.filtered} />}</>;
});
