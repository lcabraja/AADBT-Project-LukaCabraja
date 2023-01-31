import { component$ } from "@builder.io/qwik";
import type { Post as PostModel } from "~/models/post";

interface PostProps {
  post: PostModel;
}

export const Post = component$((props: PostProps) => {
  return (
    <div key={props.post.id}>
      <img src={props.post.filtered} />
      <p>{props.post.description}</p>
      <p>{props.post.hashtags}</p>
    </div>
  );
});
