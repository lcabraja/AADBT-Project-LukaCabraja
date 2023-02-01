import { component$, useStore, useStylesScoped$ } from "@builder.io/qwik";
import { type Post as PostModel } from "~/models/post";
import { UserCircle } from "../icons/user";
import { type User } from "~/models/user";
import styles from "./post.css?inline";

interface PostProps {
  post: PostModel;
}

export const Post = component$((props: PostProps) => {
  useStylesScoped$(styles);

  const store = useStore({ error: false });

  return (
    <div class="feed-item" key={props.post.id}>
      <div class="feed-header">
        <div class="avatar">
          {!store.error ? (
            <img
              onError$={() => (store.error = true)}
              src={(props.post.poster as User).avatar}
            />
          ) : (
            <UserCircle />
          )}
        </div>
        <p class="username">{(props.post.poster as User).username}</p>
      </div>
      <img src={props.post.filtered} />
      <p class="description">{props.post.description}</p>
      <p class="hashtags">{props.post.hashtags}</p>
    </div>
  );
});
