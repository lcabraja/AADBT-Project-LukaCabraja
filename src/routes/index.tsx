import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Post } from "../components/post/post";
import type { Post as PostModel} from "~/models/post";
import { randomUUID } from "crypto";

export default component$(() => {
  const testUrl = "https://aadbt.lcabraja.dev/api/files/107brmbodrfbtjx/o4w81m36xogtzft/mirkooo_enahnced_dIfCOK8IZI.png";
  const testPost: PostModel = {
    id: randomUUID(),
    original: testUrl,
    filtered: testUrl,
    description: "usagi-chan mirko desu ✌️",
    hashtags: "#mirko #usagi",
    poster: "lcabraja"
  }
  const posts = [testPost, testPost, testPost, testPost];
  return (
    <div>
      <h1>
        # posts today <span class="lightning">🎞️</span>
      </h1>
      {posts.map((post) => (
        <Post post={post} />
      ))}
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
